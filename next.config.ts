import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Dev-only "N" badge would cover the sidebar's user card in the bottom-left
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
