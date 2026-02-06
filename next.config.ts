import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', '127.0.0.1', 'lh3.googleusercontent.com', ],
  },
};

export default nextConfig;
