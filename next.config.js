/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'via.placeholder.com',
      'images.unsplash.com'
    ],
    unoptimized: true
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.wuyou-service.vercel.app',
  }
}

module.exports = nextConfig
