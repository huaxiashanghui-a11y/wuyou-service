/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'via.placeholder.com'],
    unoptimized: true
  },
  output: 'export',
  trailingSlash: true
}

module.exports = nextConfig
