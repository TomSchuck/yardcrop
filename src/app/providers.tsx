"use client";

import { ReactNode } from "react";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListingsProvider } from "@/contexts/ListingsContext";
import { FlagsProvider } from "@/contexts/FlagsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ListingsProvider>
          <FlagsProvider>{children}</FlagsProvider>
        </ListingsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
