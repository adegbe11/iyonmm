import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: { absolute: "Free PDF, Video & Image Tools Online (100% Secure) | IYONM" },
  description:
    "Edit PDFs, compress videos, and convert images directly in your browser. 100% private with no server uploads, no data logs, and unlimited file sizes.",
  alternates: { canonical: "/" },
};

const SITE = "https://www.iyonm.com";

// ItemList of the catalog helps Google and AI engines map every tool we offer.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "IYONM Tools",
  itemListElement: tools.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    url: `${SITE}${t.href}`,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Are IYONM tools really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every tool is free with no signup, no file-size limits, and no watermarks." } },
    { "@type": "Question", name: "Are my files uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. IYONM processes files entirely in your browser, so they never leave your device." } },
    { "@type": "Question", name: "Is IYONM a good iLovePDF alternative?", acceptedAnswer: { "@type": "Answer", text: "Yes. IYONM offers the same core PDF and image tools plus video and developer tools, and unlike iLovePDF it never uploads your files and has no limits or signup." } },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <HomeClient />
    </>
  );
}
