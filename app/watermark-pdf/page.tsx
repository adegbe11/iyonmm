import type { Metadata } from "next";
import WatermarkPdfClient from "./WatermarkPdfClient";

export const metadata: Metadata = {
  title: "Add Watermark to PDF Online Free",
  description: "Add a custom text watermark to every page of your PDF. Choose font size, color, opacity, and angle. Free, client-side, nothing uploaded.",
  alternates: { canonical: "https://www.iyonm.com/watermark-pdf" },
};

export default function WatermarkPdfPage() {
  return <WatermarkPdfClient />;
}
