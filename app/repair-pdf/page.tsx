import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Repair PDF Online Free, Fix Corrupted PDF Files",
  description: "Try to repair a damaged or corrupted PDF by rebuilding its structure. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/repair-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Repair PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
