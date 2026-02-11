"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, LoginInput, SignupInput } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  signup: (input: SignupInput) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (input: LoginInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock validation
    if (!input.email.includes("@")) {
      setIsLoading(false);
      return { success: false, error: "Invalid email address" };
    }

    if (input.password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Mock successful login
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: input.email,
      displayName: input.email.split("@")[0],
      neighborhood: "North County SD",
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  const signup = useCallback(async (input: SignupInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock validation
    if (!input.email.includes("@")) {
      setIsLoading(false);
      return { success: false, error: "Invalid email address" };
    }

    if (input.password.length < 6) {
      setIsLoading(false);
      return { success: false, error: "Password must be at least 6 characters" };
    }

    if (input.displayName.length < 2 || input.displayName.length > 50) {
      setIsLoading(false);
      return { success: false, error: "Display name must be 2-50 characters" };
    }

    if (!input.neighborhood) {
      setIsLoading(false);
      return { success: false, error: "Please select a neighborhood" };
    }

    if (!input.agreedToGuidelines) {
      setIsLoading(false);
      return { success: false, error: "You must agree to the community guidelines" };
    }

    // Mock successful signup
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: input.email,
      displayName: input.displayName,
      neighborhood: input.neighborhood,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful Google login
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: "googleuser@gmail.com",
      displayName: "Google User",
      neighborhood: "North County SD",
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
