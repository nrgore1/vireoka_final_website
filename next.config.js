/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,

  // Helps hosts that infer the wrong root (Hostinger warning)
  turbopack: {
    root: path.join(__dirname),
  },

  async redirects() {
    return [
      {
        source: "/investors",
        destination: "/intelligence",
        permanent: true,
      },
      {
        source: "/investors/:path*",
        destination: "/intelligence/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
