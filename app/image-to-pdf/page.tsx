import type { Metadata } from "next";
import ImageToPdfClient from "./ImageToPdfClient";

export const metadata: Metadata = {
  title: "Image to PDF Online Free, Convert JPG and PNG to PDF",
  description: "Convert one or more images (JPG, PNG, WebP) into a single PDF. Free, client-side, nothing uploaded. Reorder images before converting.",
  alternates: { canonical: "https://iyonm.com/image-to-pdf" },
};

export default function ImageToPdfPage() {
  return <ImageToPdfClient />;
}
