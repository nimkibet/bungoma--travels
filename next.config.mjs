import { join, resolve } from "path";
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;
    img-src 'self' blob: data: https://images.unsplash.com/ https://images.pexels.com/ https://platform-lookaside.fbsbx.com/ https://res.cloudinary.com/ https://upload.wikimedia.org/;
    font-src 'self' https://fonts.gstatic.com/;
    object-src 'self';
    frame-src 'self' https://www.openstreetmap.org/ https://js.stripe.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
/** @type {import('next').NextConfig} */

const helperDirName = join(process.cwd(), "lib/email/", "helpersHbs");

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.hbs$/,
      use: [
        {
          loader: "handlebars-loader",
          options: {
            strict: true,
            noEscape: true,
            helperDirs: [resolve(helperDirName)],
          },
        },
      ],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "golob-travel-agency.vercel.app",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "www.airplane-pictures.net",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/user/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/user/signup",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Pathname",
            value: "/:path*",
          },
        ],
      },
    ];
  },
  serverExternalPackages: ["mongoose", "handlebars", "handlebars-loader", "node-mailjet"],
};

export default nextConfig;
