/** @type {import('next').NextConfig} */
const nextMDX = require('@mdx-js/loader');

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: nextMDX.loader,
          options: {
            providerImportSource: '@mdx-js/react',
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
