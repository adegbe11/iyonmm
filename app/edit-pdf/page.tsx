import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Edit PDF Online Free, Add Text to a PDF",
  description: "Add text anywhere on a PDF, choose size and color, then download. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/edit-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Edit PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
