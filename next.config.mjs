/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@anthropic-ai/sdk", "pdfjs-dist", "mammoth"],
  },
  webpack: (config) => {
    // pdfjs-dist tries to import canvas for rendering; we only need text extraction
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
