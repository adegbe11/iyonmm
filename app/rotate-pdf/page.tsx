import type { Metadata } from "next";
import RotatePdfClient from "./RotatePdfClient";

export const metadata: Metadata = {
  title: "Rotate PDF Online Free, Fix Page Orientation",
  description: "Rotate PDF pages 90, 180, or 270 degrees. Rotate all pages or specific ones. Free, instant, nothing uploaded.",
  alternates: { canonical: "https://www.iyonm.com/rotate-pdf" },
};

export default function RotatePdfPage() {
  return <RotatePdfClient />;
}
