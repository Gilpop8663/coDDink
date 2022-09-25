/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

const nextConfig = removeImports({
  reactStrictMode: true,
  images: {
    domains: ["user-images.githubusercontent.com", "imagedelivery.net"],
  },
  experimental: { esmExternals: true },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
});

module.exports = nextConfig;
