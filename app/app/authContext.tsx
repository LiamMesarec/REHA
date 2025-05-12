import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getItem, setItem, deleteItem } from './storage';

type AuthContextType = {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getItem("token").then((t) => {
      if (t) setToken(t);
    });
  }, []);

  const login = async (t: string) => {
    await setItem("token", t);
    setToken(t);
  };

  const logout = async () => {
    await deleteItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

