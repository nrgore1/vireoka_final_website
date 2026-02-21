/**
 * Wrapper config:
 * - Keeps your existing config in next.config.base.js untouched.
 * - Avoids unsupported next.config keys on Next.js 16.
 */
const base = require("./next.config.base.js");

function withHostSafeConfig(cfg) {
  // Keep behavior identical except we do NOT inject unsupported keys like outputFileTracing.
  // Hostinger stability is achieved by building with: `next build --webpack` (not via config).
  return cfg;
}

module.exports =
  typeof base === "function"
    ? async (...args) => withHostSafeConfig(await base(...args))
    : withHostSafeConfig(base);
