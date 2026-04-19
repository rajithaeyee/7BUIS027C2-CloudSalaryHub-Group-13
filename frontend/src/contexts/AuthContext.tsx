import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as apiLogin,
  signup as apiSignup,
  getMe,
} from "../services/api";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  // Restore session on mount — validate stored token with the server
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      getMe()
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password);
    const { access_token, user_id, username } = response.data;
    localStorage.setItem("token", access_token);
    setToken(access_token);
    setUser({ id: user_id, email, username });
  };

  const signup = async (email: string, username: string, password: string) => {
    const response = await apiSignup(email, username, password);
    const { access_token, user_id, username: name } = response.data;
    localStorage.setItem("token", access_token);
    setToken(access_token);
    setUser({ id: user_id, email, username: name });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
      }}
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
