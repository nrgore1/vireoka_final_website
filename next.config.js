/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,

  // Ensures correct root resolution on shared hosts (Hostinger)
  turbopack: {
    root: path.join(__dirname),
  },

  async redirects() {
    return [
      // Explicit legacy investor routes
      {
        source: "/investors",
        destination: "/intelligence",
        permanent: true,
      },
      {
        source: "/investors/nda",
        destination: "/intelligence/nda",
        permanent: true,
      },
      {
        source: "/investors/apply",
        destination: "/intelligence/apply",
        permanent: true,
      },
      {
        source: "/investors/status",
        destination: "/intelligence/status",
        permanent: true,
      },
      {
        source: "/investors/deck",
        destination: "/intelligence/deck",
        permanent: true,
      },

      // Catch-all fallback for any other legacy route
      {
        source: "/investors/:path*",
        destination: "/intelligence/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
