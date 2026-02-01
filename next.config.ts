import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zotytiupdmdakfxeigam.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'evolvingwithcheta.com',
      },
      {
        protocol: 'https',
        hostname: 'whitefieldapartments.com',
      },
    ],
  },
};

export default nextConfig;
