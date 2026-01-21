"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "admin" | "user" | null;

type AuthContextType = {
  token: string | null;
  role: Role;
  login: (token: string, role: Role) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role") as Role);
  }, []);

  function login(token: string, role: Role) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setToken(token);
    setRole(role);
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
