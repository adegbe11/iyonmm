import type { Metadata } from "next";
import RemovePagesClient from "./RemovePagesClient";

export const metadata: Metadata = {
  title: "Remove Pages from PDF Online Free",
  description: "Delete specific pages from any PDF. Select pages to remove, preview, then download. Free, client-side, nothing uploaded.",
  alternates: { canonical: "https://www.iyonm.com/remove-pages" },
};

export default function RemovePagesPage() {
  return <RemovePagesClient />;
}
