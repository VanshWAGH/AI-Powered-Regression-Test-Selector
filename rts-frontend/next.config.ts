import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker/serverless deployments
  output: "standalone",

  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Allow unoptimized images for static export compatibility
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Production optimizations
  reactStrictMode: true,

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
