import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.revcomps.com", pathname: "/**" },
      { protocol: "https", hostname: "7days-production.s3.eu-west-2.amazonaws.com", pathname: "/**" },
      { protocol: "https", hostname: "media.dreamcargiveaways.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "mckinneycompetitions.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.mckinneycompetitions.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "imagedelivery.net", pathname: "/**" },
      { protocol: "https", hostname: "mckinneycompetitions.com", pathname: "/**" },
      { protocol: "https", hostname: "www.mckinneycompetitions.com", pathname: "/**" },
      { protocol: "https", hostname: "thegiveawayguys.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.thegiveawayguys.co.uk", pathname: "/**" },
    ],
  },
};

export default nextConfig;
