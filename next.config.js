import path from 'path';

const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"]
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, ''); // Assuming your project is in the root directory
    return config;
  },
};

module.exports = nextConfig;