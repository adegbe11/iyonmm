import type { Metadata } from "next";
import PdfToPngClient from "./PdfToPngClient";

export const metadata: Metadata = {
  title: "PDF to PNG Online Free, Convert PDF Pages to PNG",
  description: "Convert every page of your PDF to high quality PNG images. Free, nothing uploaded, runs in your browser. Download each page or all at once.",
  alternates: { canonical: "https://iyonm.com/pdf-to-png" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "PDF to PNG", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Are my PDFs uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Conversion uses PDF.js in your browser. Nothing is uploaded." } },
        { "@type": "Question", name: "Why PNG instead of JPG?", acceptedAnswer: { "@type": "Answer", text: "PNG is lossless and supports sharp edges and text, ideal for diagrams and screenshots." } },
        { "@type": "Question", name: "Is there a page limit?", acceptedAnswer: { "@type": "Answer", text: "No. Convert PDFs of any length." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "PDF to PNG", item: "https://iyonm.com/pdf-to-png" }] },
  ],
};

export default function PdfToPngPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PdfToPngClient />
    </>
  );
}
