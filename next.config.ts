import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config) {
        // Find the existing rule for handling image files (which usually includes SVG by default)
        const fileLoaderRule = config.module.rules.find((rule:any) =>
            rule.test && rule.test.test && rule.test.test('.svg')
        );

        // If the rule exists, exclude SVG from it so @svgr/webpack can handle it
        if (fileLoaderRule) {
            fileLoaderRule.exclude = /\.svg$/;
        }

        // Add a new rule for @svgr/webpack to process SVGs as React components
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.(js|ts|jsx|tsx)$/, // Only apply to files importing into JS/TS/JSX/TSX
            use: ['@svgr/webpack'], // Use the SVGR loader
        });

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'docs.google.com',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'placeholder.svg',
                port: '',
                pathname: '/**',
            },
        ],
        unoptimized: true,
    }
};

export default nextConfig;