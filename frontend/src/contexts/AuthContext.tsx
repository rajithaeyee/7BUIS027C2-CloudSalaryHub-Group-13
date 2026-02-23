import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin } from "../services/api";

interface AuthContextType {
  user: { id: number; email: string } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    // If token exists, we could verify it with the backend and fetch user info
    // For simplicity, we'll just store token and assume it's valid.
    // In a real app, you might want to decode the JWT to get user info.
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    const { token } = response.data;
    localStorage.setItem("token", token);
    setToken(token);
    // Optionally decode token to get user info (we can add a /me endpoint later)
    // For now, just store email in state from login response? Actually backend may not return user info.
    // We'll keep user as null, and only use token for auth.
    // For UI purposes, we can store email in context after login if needed.
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
