import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ["@imgly/background-removal", "onnxruntime-web", "tesseract.js"],
};

export default nextConfig;
