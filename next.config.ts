import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.revcomps.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
