import type { Metadata } from "next";
import SplitPdfClient from "./SplitPdfClient";

export const metadata: Metadata = {
  title: "Split PDF Online Free, Pull Out Pages Fast",
  description: "Split a PDF into individual pages or extract a page range. Free, client-side, no upload. Download as separate files or one combined PDF.",
  alternates: { canonical: "https://iyonm.com/split-pdf" },
};

export default function SplitPdfPage() {
  return <SplitPdfClient />;
}
