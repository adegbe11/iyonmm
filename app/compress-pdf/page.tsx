import type { Metadata } from "next";
import CompressPdfClient from "./CompressPdfClient";

export const metadata: Metadata = {
  title: "Compress PDF Online Free, Reduce PDF Size Fast",
  description: "Compress PDF files without losing quality. 100% free, client-side processing, your files never leave your browser. No signup, no limits.",
  alternates: { canonical: "https://iyonm.com/compress-pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "PDF Compressor", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How much can I compress a PDF?", acceptedAnswer: { "@type": "Answer", text: "Compression results vary by file. Image-heavy PDFs typically compress 40-80%. Text-only PDFs may compress 10-30%." } },
        { "@type": "Question", name: "Does compressing a PDF reduce quality?", acceptedAnswer: { "@type": "Answer", text: "Our balanced mode removes redundant metadata while preserving visual quality. Aggressive mode compresses embedded images further." } },
        { "@type": "Question", name: "Are my PDFs secure?", acceptedAnswer: { "@type": "Answer", text: "Yes. All compression runs in your browser with pdf-lib. Your files never leave your device." } },
        { "@type": "Question", name: "Is there a file size limit?", acceptedAnswer: { "@type": "Answer", text: "No size limit. Processing is only bound by your device memory." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "Compress PDF", item: "https://iyonm.com/compress-pdf" }] },
  ],
};

export default function CompressPdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressPdfClient />
    </>
  );
}
