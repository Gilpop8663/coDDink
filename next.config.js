/** @type {import('next').NextConfig} */

const removeImports = require('next-remove-imports')();

const nextConfig = removeImports({
  reactStrictMode: true,
  images: {
    domains: ['d3319kcxpye19t.cloudfront.net'],
  },
  experimental: { esmExternals: true },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
});

module.exports = nextConfig;
