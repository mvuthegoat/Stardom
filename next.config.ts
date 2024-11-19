import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [(process.env.NEXT_PUBLIC_CLOUDFRONT_URL ?? '').replace(/^https?:\/\//, '')], // Ensure the domain is valid
  },
};

export default nextConfig;

