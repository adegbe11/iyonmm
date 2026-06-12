import type { Metadata } from "next";
import MergePdfClient from "./MergePdfClient";

export const metadata: Metadata = {
  title: "Merge PDF Online Free, Combine PDFs Fast",
  description: "Combine multiple PDF files into one. Free, no upload, no limits. Drag to reorder, then download your merged PDF.",
  alternates: { canonical: "https://iyonm.com/merge-pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "PDF Merger", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is merging PDFs free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no page or file limits." } },
        { "@type": "Question", name: "Are my PDFs uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Merging happens entirely in your browser with pdf-lib. Files never leave your device." } },
        { "@type": "Question", name: "How many PDFs can I merge?", acceptedAnswer: { "@type": "Answer", text: "No limit. Merge as many files as you need." } },
        { "@type": "Question", name: "Can I reorder the files before merging?", acceptedAnswer: { "@type": "Answer", text: "Yes. Drag and drop to reorder your PDFs before downloading." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "Merge PDF", item: "https://iyonm.com/merge-pdf" }] },
  ],
};

export default function MergePdfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MergePdfClient />
    </>
  );
}
