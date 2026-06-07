import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "PDF to Markdown Converter, Free & Clean (for Notion, Obsidian)",
  description: "Convert a PDF into clean Markdown for Notion, Obsidian, or any notes app. Strips headers, fixes broken line breaks and hyphens. Free, nothing uploaded.",
  alternates: { canonical: "https://iyonm.com/pdf-to-markdown" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "PDF to Markdown", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Why convert PDF to Markdown?", acceptedAnswer: { "@type": "Answer", text: "Markdown drops cleanly into Notion, Obsidian, and other note apps without the messy formatting you get from copy-pasting a PDF." } },
      { "@type": "Question", name: "Are my PDFs uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Conversion runs in your browser with PDF.js. Nothing leaves your device." } },
      { "@type": "Question", name: "Does it work on scanned PDFs?", acceptedAnswer: { "@type": "Answer", text: "No. Scanned PDFs are images. Run OCR PDF first to get a text layer, then convert." } },
    ] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "PDF to Markdown", item: "https://iyonm.com/pdf-to-markdown" }] },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Client />
    </>
  );
}
