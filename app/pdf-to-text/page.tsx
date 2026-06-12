import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "PDF to Text Online Free, Extract Text from PDF",
  description: "Extract all text from a PDF and copy it or download a .txt file. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://iyonm.com/pdf-to-text" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "PDF to Text", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
