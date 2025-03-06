import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // API requests from frontend
        destination: "http://localhost:5000/api/:path*", // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
