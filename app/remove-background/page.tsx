import type { Metadata } from "next";
import RemoveBgClient from "./RemoveBgClient";

export const metadata: Metadata = {
  title: "Remove Image Background Online Free, AI Powered",
  description: "Remove image backgrounds instantly using AI, runs 100% in your browser. Free, no upload, no signup. Export as transparent PNG.",
  alternates: { canonical: "https://www.iyonm.com/remove-background" },
};

export default function RemoveBackgroundPage() {
  return <RemoveBgClient />;
}
