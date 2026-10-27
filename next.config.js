const path = require('path');

const nextConfig = {
  agentRules: false,
  // Turbopack (default in Next 16) resolves "@/*" from tsconfig paths; the webpack alias below only applies to `next build --webpack`.
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }, // seed data images
    ]
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, ''); // Assuming your project is in the root directory
    return config;
  },
};

module.exports = nextConfig;
