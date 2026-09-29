import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from overwriting an active development server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  turbopack: { root: process.cwd() },
  serverExternalPackages: ["@imgly/background-removal", "onnxruntime-web", "tesseract.js"],
};

export default nextConfig;
