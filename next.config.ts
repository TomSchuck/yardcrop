import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for compatibility with react-map-gl and mapbox-gl
  // Can re-enable once Turbopack has better support for these packages
  experimental: {
    // Using webpack for better compatibility
  },

  // Transpile mapbox-gl for proper bundling
  transpilePackages: ['mapbox-gl', 'react-map-gl'],
};

export default nextConfig;
