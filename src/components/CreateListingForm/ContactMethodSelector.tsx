"use client";

import { ContactMethod } from "@/lib/types";

interface ContactMethodSelectorProps {
  method: ContactMethod;
  onMethodChange: (value: ContactMethod) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
}

export default function ContactMethodSelector({
  method,
  onMethodChange,
  phone,
  onPhoneChange,
  email,
  onEmailChange,
}: ContactMethodSelectorProps) {
  const showPhone = method === "phone" || method === "both";
  const showEmail = method === "email" || method === "both";

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-charcoal">
        Contact Method <span className="text-error-red">*</span>
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="contactMethod"
            value="phone"
            checked={method === "phone"}
            onChange={() => onMethodChange("phone")}
            className="w-4 h-4 text-garden-green focus:ring-garden-green"
          />
          <span className="text-sm text-charcoal">Phone</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="contactMethod"
            value="email"
            checked={method === "email"}
            onChange={() => onMethodChange("email")}
            className="w-4 h-4 text-garden-green focus:ring-garden-green"
          />
          <span className="text-sm text-charcoal">Email</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="contactMethod"
            value="both"
            checked={method === "both"}
            onChange={() => onMethodChange("both")}
            className="w-4 h-4 text-garden-green focus:ring-garden-green"
          />
          <span className="text-sm text-charcoal">Both</span>
        </label>
      </div>

      <div className="space-y-3">
        {showPhone && (
          <div>
            <label className="block text-sm text-warm-gray mb-1">
              Phone Number <span className="text-error-red">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(760) 555-0123"
              required={showPhone}
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
          </div>
        )}
        {showEmail && (
          <div>
            <label className="block text-sm text-warm-gray mb-1">
              Email Address <span className="text-error-red">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
              required={showEmail}
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
            />
          </div>
        )}
      </div>
    </div>
  );
}
