"use client";

import { createContext, useContext } from "react";

type AuthContextValue = {
  accessToken: string | null;
  isLoggedIn: boolean;
  name: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  accessToken: null,
  isLoggedIn: false,
  name: null,
});

export function AuthProvider({
  accessToken,
  name,
  children,
}: {
  accessToken: string | null;
  name: string | null;
  children: React.ReactNode;
}) {
  const value = {
    accessToken,
    isLoggedIn: Boolean(accessToken),
    name,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
