"use client";

import { createContext, useContext } from "react";

type AuthContextValue = {
  accessToken: string | null;
  isLoggedIn: boolean;
  name: string | null;
  imageUrl: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  accessToken: null,
  isLoggedIn: false,
  name: null,
  imageUrl: null,
});

export function AuthProvider({
  accessToken,
  name,
  imageUrl,
  children,
}: {
  accessToken: string | null;
  name: string | null;
  imageUrl: string | null;
  children: React.ReactNode;
}) {
  const value = {
    accessToken,
    isLoggedIn: Boolean(accessToken),
    name,
    imageUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
