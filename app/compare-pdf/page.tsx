import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Compare PDF Online Free, Find Text Differences",
  description: "Compare two PDFs and highlight what changed. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/compare-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Compare PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
