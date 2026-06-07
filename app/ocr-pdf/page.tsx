import type { Metadata } from "next";
import OcrPdfClient from "./OcrPdfClient";

export const metadata: Metadata = {
  title: "OCR PDF Online Free, Make Scanned PDFs Searchable",
  description: "Extract text from scanned PDFs and images using OCR. Free, runs in your browser, nothing uploaded. Supports 100+ languages.",
  alternates: { canonical: "https://www.iyonm.com/ocr-pdf" },
};

export default function OcrPdfPage() {
  return <OcrPdfClient />;
}
