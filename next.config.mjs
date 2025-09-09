/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  images: {
    unoptimized: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless', 'jose']
  }
};

export default nextConfig;
