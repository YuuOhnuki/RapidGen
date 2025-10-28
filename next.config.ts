import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname:
                    'a223539ccf6caa2d76459c9727d276e6.r2.cloudflarestorage.com',
            },
        ],
    },
};

export default nextConfig;
