/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // STATIC_EXPORT=1 produces a plain static site in ./out (for Cloudflare Pages,
  // GitHub Pages, any static host). The app has no server code, so nothing is lost.
  ...(process.env.STATIC_EXPORT ? { output: "export" } : {}),
};
module.exports = nextConfig;
