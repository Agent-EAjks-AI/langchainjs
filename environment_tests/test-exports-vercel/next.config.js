/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack is the default bundler in Next.js 16+.
  // Alias node: protocol imports and stub out Node.js built-ins that are
  // unavailable in the browser (equivalent to the old webpack resolve.fallback).
  turbopack: {
    resolveAlias: {
      "node:async_hooks": "./src/empty.js",
      "node:fs": "./src/empty.js",
      "node:fs/promises": "./src/empty.js",
      "node:path": "./src/empty.js",
      async_hooks: "./src/empty.js",
      fs: "./src/empty.js",
      path: "./src/empty.js",
      typeorm: "./src/empty.js",
    },
  },
};

module.exports = nextConfig;
