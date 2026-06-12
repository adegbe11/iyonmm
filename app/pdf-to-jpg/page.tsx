import type { Metadata } from "next";
import PdfToJpgClient from "./PdfToJpgClient";

export const metadata: Metadata = {
  title: "PDF to JPG Online Free, Turn PDF Pages into Images",
  description: "Convert every page of your PDF to JPG images. Free, client-side, nothing uploaded. Download individually or as a zip.",
  alternates: { canonical: "https://iyonm.com/pdf-to-jpg" },
};

export default function PdfToJpgPage() {
  return <PdfToJpgClient />;
}
