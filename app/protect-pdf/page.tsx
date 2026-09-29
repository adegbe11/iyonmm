import type { Metadata } from "next";
import ProtectPdfClient from "./ProtectPdfClient";

export const metadata: Metadata = {
  title: "Protect PDF with Password Online Free",
  description: "Encrypt PDFs with AES-256 password protection locally in your browser. Free, no file uploads. Save a protected copy without changing your original.",
  alternates: { canonical: "https://www.iyonm.com/protect-pdf" },
};

export default function ProtectPdfPage() {
  return <ProtectPdfClient />;
}
