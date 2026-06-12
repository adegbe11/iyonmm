import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Scan to PDF Online Free, Camera or Images to PDF",
  description: "Scan documents with your camera or combine photos into a PDF. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://iyonm.com/scan-to-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Scan to PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
