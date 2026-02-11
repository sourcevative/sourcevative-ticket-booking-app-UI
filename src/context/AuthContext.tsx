// 

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Role = "admin" | "user" | null;

type AuthContextType = {
  token: string | null;
  role: Role;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  // 🔹 ONLY read from localStorage
  useEffect(() => {
    setToken(localStorage.getItem("access_token"));

    const r = localStorage.getItem("role");
    if (r === "admin" || r === "user") setRole(r);
    else setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}



