import type { Metadata } from "next";
import LegalAuditorClient from "./LegalAuditorClient";

export const metadata: Metadata = {
  title: "Contract Risk Scanner, Find Risky Clauses Free (No Upload)",
  description: "Scan a contract or policy for predatory clauses, missing protections, and GDPR / HIPAA gaps. Runs entirely in your browser, nothing uploaded, no signup.",
  alternates: { canonical: "https://iyonm.com/ai-legal-auditor" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "Contract Risk Scanner", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What can the scanner check?", acceptedAnswer: { "@type": "Answer", text: "It flags predatory or one-sided clauses, missing standard protections, and data-privacy gaps under GDPR, CCPA, and HIPAA, with a plain-English explanation and a fix for each." } },
        { "@type": "Question", name: "Is this a replacement for a lawyer?", acceptedAnswer: { "@type": "Answer", text: "No. It is an automated red-flag scan to help you spot issues fast. For binding decisions, consult a qualified attorney." } },
        { "@type": "Question", name: "How is my document handled?", acceptedAnswer: { "@type": "Answer", text: "The entire scan runs in your browser. Your document never leaves your device, and no AI service or API key is involved." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "Contract Risk Scanner", item: "https://iyonm.com/ai-legal-auditor" }] },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LegalAuditorClient />
    </>
  );
}
