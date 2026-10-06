import type { NextConfig } from "next";

// The browser only talks to this app; /api/v1/* is forwarded to the backend so its
// session cookies are first-party here (readable by proxy.ts, no CORS)
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:5000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Dev-only "N" badge would cover the sidebar's user card in the bottom-left
  devIndicators: { position: "bottom-right" },
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${BACKEND_URL}/api/v1/:path*` }];
  },
};

export default nextConfig;
