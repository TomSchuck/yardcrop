"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const result = await loginWithGoogle();

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Google login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    alert("Password reset functionality coming soon! For now, this is a placeholder.");
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-soft-white border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
          >
            <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-charcoal">Log In</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌱</div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Welcome back!</h2>
          <p className="text-warm-gray">Sign in to share your harvest with neighbors</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-red/10 border border-error-red/20 rounded-lg px-4 py-3 text-error-red text-sm mb-6">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-charcoal">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-charcoal">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-garden-green hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-garden-green text-white font-semibold py-3 rounded-lg hover:bg-garden-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-warm-gray">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-border rounded-lg py-3 font-semibold text-charcoal hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-warm-gray mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-garden-green font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
