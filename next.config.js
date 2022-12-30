/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    MODE: process.env.NEXT_PUBLIC_MODE,
  },
};

module.exports = nextConfig;
