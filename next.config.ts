import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      (process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? "").replace(
        /^https?:\/\//,
        ""
      ),
      "img-v1.raydium.io", // Add Raydium's image domain
      "coin-images.coingecko.com", // Add CoinGecko's image domain
    ],
  },
};

export default nextConfig;
