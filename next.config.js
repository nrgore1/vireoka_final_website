/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  // Helps hosting environments that end up with multiple lockfiles / inferred roots
  turbopack: {
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;
