import type { Metadata } from "next";
import PdfReflowClient from "./PdfReflowClient";

export const metadata: Metadata = {
  title: "Make a PDF Readable on Mobile, Free PDF Reflow Tool",
  description: "Reflow any multi-column PDF into a clean, single-column reading view that fits your phone. No more pinch and zoom. Free, nothing uploaded, runs in your browser.",
  alternates: { canonical: "https://iyonm.com/pdf-reflow" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "PDF Reflow for Mobile", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What does reflowing a PDF do?", acceptedAnswer: { "@type": "Answer", text: "It rebuilds a fixed, multi-column PDF into a single flowing column of text that resizes to your screen, so you can read it on a phone without pinching and zooming." } },
        { "@type": "Question", name: "Are my PDFs uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. The whole process runs in your browser using PDF.js. Your file never leaves your device." } },
        { "@type": "Question", name: "Does it work on scanned PDFs?", acceptedAnswer: { "@type": "Answer", text: "No. Scanned PDFs are images with no text layer. Run OCR PDF first, then reflow." } },
        { "@type": "Question", name: "Can I save the reflowed version?", acceptedAnswer: { "@type": "Answer", text: "Yes. You can download the clean reading view as an HTML file that opens in any browser." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "PDF Reflow", item: "https://iyonm.com/pdf-reflow" }] },
  ],
};

export default function PdfReflowPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PdfReflowClient />
    </>
  );
}
