import type { Metadata } from "next";
import PdfToFormClient from "./PdfToFormClient";

export const metadata: Metadata = {
  title: "Fill PDF Forms Online Free, Turn a PDF into a Web Form",
  description: "Turn any PDF form into a clean, mobile-friendly web form, fill it out, and download the completed PDF. Free, runs in your browser, nothing uploaded.",
  alternates: { canonical: "https://www.iyonm.com/pdf-to-form" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "PDF to Web Form", applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "How does it work?", acceptedAnswer: { "@type": "Answer", text: "It reads the fillable fields in your PDF and rebuilds them as a clean web form. You fill it in, and we write your answers back into the original PDF." } },
        { "@type": "Question", name: "Are my files uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Everything runs in your browser. Your PDF never leaves your device." } },
        { "@type": "Question", name: "My PDF has no fillable fields. Will it work?", acceptedAnswer: { "@type": "Answer", text: "This tool needs a PDF that already has form fields (an AcroForm). Flat scans without fields are not supported yet." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: "PDF to Form", item: "https://www.iyonm.com/pdf-to-form" }] },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PdfToFormClient />
    </>
  );
}
