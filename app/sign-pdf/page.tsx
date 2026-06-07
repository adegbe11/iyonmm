import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Sign PDF Online Free, Add Your Signature (No Upload)",
  description: "Draw or type your signature and place it on a PDF, then download. Free, no signup, runs entirely in your browser. Your document never leaves your device.",
  alternates: { canonical: "https://www.iyonm.com/sign-pdf" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "Sign PDF", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Are my documents uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Signing happens entirely in your browser with pdf-lib. Your PDF never leaves your device." } },
      { "@type": "Question", name: "Can I draw and type a signature?", acceptedAnswer: { "@type": "Answer", text: "Yes. Draw with your mouse or finger, or type your name in a signature font." } },
      { "@type": "Question", name: "Is an e-signature legally valid?", acceptedAnswer: { "@type": "Answer", text: "Simple e-signatures are accepted for many purposes, but requirements vary by country and document. Check your local rules for important contracts." } },
    ] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: "Sign PDF", item: "https://www.iyonm.com/sign-pdf" }] },
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
