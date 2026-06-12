import type { Metadata } from "next";
import SplitPdfClient from "../split-pdf/SplitPdfClient";

export const metadata: Metadata = {
  title: "Extract Pages from PDF Online Free",
  description: "Extract specific pages from a PDF and save them as a new document. Free, client-side, nothing uploaded.",
  alternates: { canonical: "https://www.iyonm.com/extract-pages" },
};

export default function ExtractPagesPage() {
  return <SplitPdfClient />;
}
