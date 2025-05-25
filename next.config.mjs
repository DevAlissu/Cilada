const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ["oracledb"],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: false,
      };
    }
    return config;
  },
};

export default nextConfig;
