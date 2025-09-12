import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Dev indicators configuration removed as they're deprecated in Next.js 15
  // The dev indicator is minimal by default in production builds
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
