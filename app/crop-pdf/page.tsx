import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Crop PDF Online Free, Trim Margins from PDF Pages",
  description: "Crop a PDF to remove white margins or trim edges. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/crop-pdf" },
};

const jsonLd = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Crop PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><Client /></>);
}
