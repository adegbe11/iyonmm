import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Redact PDF Online Free, Permanently Black Out Text",
  description: "Black out sensitive text in a PDF. Redactions are flattened so the hidden text is truly removed. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/redact-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Redact PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
