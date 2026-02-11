"use client";

import Link from "next/link";

export default function AboutPage() {
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
          <h1 className="text-lg font-bold text-charcoal">About YardCrop</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <div className="text-6xl mb-4">🌻🥬🍋</div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Welcome to YardCrop!</h2>
          <p className="text-warm-gray">
            A neighborly way to share your garden&apos;s bounty in North County San Diego.
          </p>
        </div>

        {/* How It Works */}
        <section className="bg-cream rounded-xl p-6">
          <h3 className="text-lg font-bold text-charcoal mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-garden-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-charcoal">Browse the Map</p>
                <p className="text-sm text-warm-gray">
                  Explore produce available near you. Filter by category to find what you need.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-garden-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-charcoal">Connect with Neighbors</p>
                <p className="text-sm text-warm-gray">
                  Find something you like? Reveal the grower&apos;s contact info to arrange pickup.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-garden-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-charcoal">Share Your Harvest</p>
                <p className="text-sm text-warm-gray">
                  Have extra produce? Create a listing to share with your community.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-garden-green text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-charcoal">Build Community</p>
                <p className="text-sm text-warm-gray">
                  Every exchange builds connections and reduces food waste. Win-win!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section>
          <h3 className="text-lg font-bold text-charcoal mb-4">Community Guidelines</h3>
          <p className="text-warm-gray mb-4">
            Our community thrives when neighbors treat each other with respect and kindness. Please follow these guidelines:
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-garden-green flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-charcoal">Be honest</span>
                <span className="text-warm-gray"> - Accurately describe your produce, including any blemishes or limitations.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-garden-green flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-charcoal">Be respectful</span>
                <span className="text-warm-gray"> - Communicate kindly with neighbors and honor agreed pickup times.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-garden-green flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-charcoal">Be safe</span>
                <span className="text-warm-gray"> - Only share produce you know is safe to eat. When in doubt, leave it out.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-garden-green flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-charcoal">Be considerate</span>
                <span className="text-warm-gray"> - Take only what you need and leave some for others.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-garden-green flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-charcoal">Be neighborly</span>
                <span className="text-warm-gray"> - This is about building community, not profit. Keep exchanges free or low-cost.</span>
              </div>
            </li>
          </ul>
        </section>

        {/* Contact/Feedback */}
        <section className="bg-harvest-gold/10 rounded-xl p-6">
          <h3 className="text-lg font-bold text-charcoal mb-2">Questions or Feedback?</h3>
          <p className="text-warm-gray mb-4">
            We&apos;d love to hear from you! YardCrop is built by neighbors, for neighbors.
          </p>
          <a
            href="mailto:hello@yardcrop.com"
            className="inline-flex items-center gap-2 text-garden-green font-semibold hover:underline"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            hello@yardcrop.com
          </a>
        </section>

        {/* Footer note */}
        <p className="text-center text-sm text-warm-gray">
          Made with love in North County San Diego
        </p>
      </main>
    </div>
  );
}
