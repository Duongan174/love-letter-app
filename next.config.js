/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tạm thời tắt Turbopack để tránh lỗi font với Be_Vietnam_Pro
  // Có thể bật lại khi Next.js fix lỗi này
  // experimental: {
  //   turbo: {},
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;