import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "IYONM, Free Online PDF, Image & Video Tools",
    short_name: "IYONM",
    description: "Free PDF, image, and video tools that run entirely in your browser. Nothing uploaded.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#673DE6",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
