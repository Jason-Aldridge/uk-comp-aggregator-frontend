import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.revcomps.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "7days-production.s3.eu-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.dreamcargiveaways.co.uk",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
