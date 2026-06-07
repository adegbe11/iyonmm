import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Organize PDF Online Free, Reorder, Rotate & Delete Pages",
  description: "Reorder, rotate, and delete PDF pages with drag-and-drop thumbnails. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/organize-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Organize PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
