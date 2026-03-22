import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, getMe } from "../services/api";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    // If token exists, fetch user info
    if (token) {
      getMe()
        .then((response) => setUser(response.data))
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    const { access_token, user_id, username } = response.data;
    localStorage.setItem("token", access_token);
    setToken(access_token);
    setUser({ id: user_id, email, username });
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
