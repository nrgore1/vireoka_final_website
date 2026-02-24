/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Pin Turbopack root to this app directory to avoid lockfile-root ambiguity.
    root: __dirname,
  },
};

module.exports = nextConfig;
