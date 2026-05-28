import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /** Traceable server bundle for Docker / Coolify (`node .next/standalone/server.js`) */
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  headers: async () => {
    const security = [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];

    // Do not mark dev HMR chunks immutable — browsers keep stale .js while
    // Turbopack serves new graphs, causing "module factory is not available".
    if (process.env.NODE_ENV !== "production") {
      return security;
    }

    return [
      ...security,
      {
        source: "/(.*)\\.(js|css|woff2|png|jpg|jpeg|avif|webp|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
