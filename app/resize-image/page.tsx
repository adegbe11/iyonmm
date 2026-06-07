import type { Metadata } from "next";
import ResizeImageClient from "./ResizeImageClient";

export const metadata: Metadata = {
  title: "Resize Image Online Free, Change Image Size",
  description: "Resize any image to exact pixel dimensions or by percentage. Free, instant, nothing uploaded. Supports JPEG, PNG, WebP.",
  alternates: { canonical: "https://iyonm.com/resize-image" },
};

export default function ResizeImagePage() {
  return <ResizeImageClient />;
}
