/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

// const ContentSecurityPolicy = `
//   default-src 'self';
//   child-src 'self';
//   style-src 'self' data:;
//   font-src 'self';
//   script-src https://accounts.google.com/gsi/client;
//   frame-src https://accounts.google.com/gsi/;
//   connect-src https://accounts.google.com/gsi/;
// `;

// const securityHeaders = [
//   {
//     key: "Content-Security-Policy",
//     value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
//   },
// ];

const nextConfig = removeImports({
  reactStrictMode: true,
  images: {
    domains: ["user-images.githubusercontent.com", "imagedelivery.net"],
  },
  experimental: { esmExternals: true },
  // async headers() {
  //   return [
  //     {
  //       // Apply these headers to all routes in your application.
  //       source: "/:path*",
  //       headers: securityHeaders,
  //     },
  //   ];
  // },
});

module.exports = nextConfig;
