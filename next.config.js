// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for static export
  output: "export",

  // Set the base path to an empty string for custom domains
  basePath: "",

  // Set the asset prefix to an empty string for custom domains
  assetPrefix: "",

  // RECOMMENDED: Disable image optimization for static exports
  // (This avoids issues with next/image)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
