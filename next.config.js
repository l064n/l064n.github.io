/** @type {import('next').NextConfig} */
const nextMDX = require('@mdx-js/loader');

const nextConfig = {
  // Static export for GitHub Pages (user site: https://l064n.github.io/)
  output: 'export',
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
