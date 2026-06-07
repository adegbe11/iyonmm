import type { Metadata } from "next";
import ProtectPdfClient from "./ProtectPdfClient";

export const metadata: Metadata = {
  title: "Protect PDF with Password Online Free",
  description: "Add password protection to any PDF file. Free, client-side, your files are never uploaded. Set open password and permission restrictions.",
  alternates: { canonical: "https://www.iyonm.com/protect-pdf" },
};

export default function ProtectPdfPage() {
  return <ProtectPdfClient />;
}
