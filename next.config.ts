import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/education-table", destination: "/achievements-table", permanent: true },
      { source: "/education/:id", destination: "/achievements/:id", permanent: true },
      { source: "/education", destination: "/achievements-table", permanent: true },
      { source: "/integration-table", destination: "/event-table", permanent: true },
      { source: "/integration/:path*", destination: "/event-table", permanent: true },
      { source: "/integration", destination: "/event-table", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "http", hostname: "192.168.**", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  webpack: (config) => {
    
    config.module.rules = config.module.rules.map((rule: { test: { test: (arg0: string) => any; }; } | null) => {
      if (
        typeof rule === "object" &&
        rule !== null &&
        "test" in rule &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
      ) {
        return { ...rule, exclude: /\.svg$/i };
      }
      return rule;
    });

    // Add SVGR loader for .svg files
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [{ name: "removeViewBox", active: false }],
            },
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
