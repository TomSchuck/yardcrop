"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

const NEIGHBORHOODS = [
  "Carlsbad",
  "Encinitas",
  "Escondido",
  "Fallbrook",
  "Oceanside",
  "San Marcos",
  "Solana Beach",
  "Vista",
  "Other North County",
];

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle, isLoading } = useAuth();
  const { showSuccess } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
  const [error, setError] = useState("");
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (displayName.length < 2 || displayName.length > 50) {
      setError("Display name must be 2-50 characters");
      return;
    }

    if (!neighborhood) {
      setError("Please select your neighborhood");
      return;
    }

    if (!agreedToGuidelines) {
      setError("You must agree to the community guidelines");
      return;
    }

    const result = await signup({
      email,
      password,
      displayName,
      neighborhood,
      agreedToGuidelines,
    });

    if (result.success) {
      showSuccess("Account created!");
      router.push("/");
    } else {
      setError(result.error || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    const result = await loginWithGoogle();

    if (result.success) {
      showSuccess("Account created!");
      router.push("/");
    } else {
      setError(result.error || "Google signup failed. Please try again.");
    }
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
          <h1 className="text-lg font-bold text-charcoal">Sign Up</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌻</div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Join YardCrop</h2>
          <p className="text-warm-gray">Connect with neighbors and share your harvest</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-red/10 border border-error-red/20 rounded-lg px-4 py-3 text-error-red text-sm mb-6">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-charcoal">
              Email <span className="text-error-red">*</span>
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
              Password <span className="text-error-red">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-charcoal">
              Confirm Password <span className="text-error-red">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              minLength={6}
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-charcoal">
              Display Name <span className="text-error-red">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Maria G."
              required
              minLength={2}
              maxLength={50}
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
            <p className="text-xs text-warm-gray">This is how neighbors will see you</p>
          </div>

          {/* Neighborhood */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-charcoal">
              Neighborhood <span className="text-error-red">*</span>
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            >
              <option value="">Select your neighborhood</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Community Guidelines Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="guidelines"
              checked={agreedToGuidelines}
              onChange={(e) => setAgreedToGuidelines(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border text-garden-green focus:ring-garden-green"
            />
            <label htmlFor="guidelines" className="text-sm text-charcoal">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowGuidelinesModal(true)}
                className="text-garden-green font-semibold hover:underline"
              >
                Community Guidelines
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-garden-green text-white font-semibold py-3 rounded-lg hover:bg-garden-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Create Account"}
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
          onClick={handleGoogleSignup}
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

        {/* Login Link */}
        <p className="text-center text-sm text-warm-gray mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-garden-green font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </main>

      {/* Community Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-charcoal">Community Guidelines</h3>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
              >
                <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4 text-sm text-charcoal">
              <p className="font-semibold text-garden-green">Welcome to YardCrop!</p>
              <p>
                Our community thrives when neighbors treat each other with respect and kindness. Please follow these guidelines:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Be honest</strong> - Accurately describe your produce, including any blemishes or limitations.
                </li>
                <li>
                  <strong>Be respectful</strong> - Communicate kindly with neighbors and honor agreed pickup times.
                </li>
                <li>
                  <strong>Be safe</strong> - Only share produce you know is safe to eat. When in doubt, leave it out.
                </li>
                <li>
                  <strong>Be considerate</strong> - Take only what you need and leave some for others.
                </li>
                <li>
                  <strong>Be neighborly</strong> - This is about building community, not profit. Keep exchanges free or low-cost.
                </li>
              </ul>
              <p className="text-warm-gray">
                Violations may result in account suspension. Let&apos;s grow together!
              </p>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-border p-4">
              <button
                onClick={() => {
                  setAgreedToGuidelines(true);
                  setShowGuidelinesModal(false);
                }}
                className="w-full bg-garden-green text-white font-semibold py-3 rounded-lg hover:bg-garden-green/90 transition-colors"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
