import type { Metadata } from "next";
import ImageToPdfClient from "../image-to-pdf/ImageToPdfClient";

export const metadata: Metadata = {
  title: "JPG to PDF Online Free, Turn Images into a PDF",
  description: "Convert JPG images to a PDF file instantly. Free, client-side, nothing uploaded. Add multiple images, reorder, then download.",
  alternates: { canonical: "https://www.iyonm.com/jpg-to-pdf" },
};

export default function JpgToPdfPage() {
  return <ImageToPdfClient />;
}
