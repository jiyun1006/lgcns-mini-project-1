"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function StaleSessionSignOut() {
  useEffect(() => {
    void signOut({ callbackUrl: `${window.location.pathname}${window.location.search}` });
  }, []);

  return null;
}
