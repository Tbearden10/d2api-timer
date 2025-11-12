import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export behaviour in Next.js 15+
  output: "export",

  // Keep images behavior as you had it
  images: {
    unoptimized: false,
  },

  // Adjust webpack config to avoid writing the persistent filesystem cache to .next/cache
  // during CI/production client builds (prevents large .pack files being created).
  webpack(config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) {
    if (!dev && !isServer) {
      config.cache = {
        type: "memory",
      };
    }
    return config;
  },
};

export default nextConfig;