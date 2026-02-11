"use client";

import { ReactNode } from "react";
import { ListingsProvider } from "@/contexts/ListingsContext";

export function Providers({ children }: { children: ReactNode }) {
  return <ListingsProvider>{children}</ListingsProvider>;
}
