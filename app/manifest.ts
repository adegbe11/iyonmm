import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IYONM, Free Online PDF, Image & Video Tools",
    short_name: "IYONM",
    description: "Free PDF, image, and video tools that run 100% in your browser. Nothing uploaded. Works offline.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#673DE6",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
    ],
  };
}
