"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListingsProvider } from "@/contexts/ListingsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ListingsProvider>{children}</ListingsProvider>
    </AuthProvider>
  );
}
