/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Security & caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Aggressive cache for static assets
      {
        source: '/favicon.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  // Redirect bare www → apex (set your real domain here)
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'www.leadforge-ai.ca' }],
        destination: 'https://leadforge-ai.ca/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
