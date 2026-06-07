import type { Metadata } from "next";
import PdfToWordClient from "./PdfToWordClient";

export const metadata: Metadata = {
  title: "PDF to Word Online Free, Convert PDF to DOCX",
  description: "Convert PDF files to editable Word (DOCX) documents in your browser. Free, no upload, fully client-side. Text extracted and rebuilt into a Word file.",
  alternates: { canonical: "https://www.iyonm.com/pdf-to-word" },
};

export default function PdfToWordPage() {
  return <PdfToWordClient />;
}
