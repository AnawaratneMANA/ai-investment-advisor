"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiUrl } from "@/lib/api";

export type User = {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  is_active: boolean;
  created_at: string;
};

type Credentials = { email: string; password: string };

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function requestUser(path: string, credentials?: Credentials): Promise<User> {
  const response = await fetch(apiUrl(path), {
    method: credentials ? "POST" : "GET",
    credentials: "include",
    headers: credentials ? { "Content-Type": "application/json" } : undefined,
    body: credentials ? JSON.stringify(credentials) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error?.message ?? "The request could not be completed.");
  }

  return response.json();
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    requestUser("/api/v1/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (credentials) => setUser(await requestUser("/api/v1/auth/login", credentials)),
      register: async (credentials) => setUser(await requestUser("/api/v1/auth/register", credentials)),
      logout: async () => {
        await fetch(apiUrl("/api/v1/auth/logout"), { method: "POST", credentials: "include" });
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

