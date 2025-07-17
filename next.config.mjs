/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com'],
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle binary files
  },
};

export default nextConfig;
