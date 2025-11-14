// next.config.js

// Replace 'my-repo-name' with the name of your GitHub repository
const repoName = 'trollball-web'; 

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for static export
  output: 'export',

  // Set the base path to your repo name
  basePath: isProd ? `/${repoName}` : '',

  // Set the asset prefix to your repo name
  assetPrefix: isProd ? `/${repoName}/` : '',

  // RECOMMENDED: Disable image optimization for static exports
  // (This avoids issues with next/image)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
