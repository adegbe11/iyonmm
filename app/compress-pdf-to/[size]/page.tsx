import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compressPdfTargets, getCompressPdfTarget } from "@/lib/seo-data";
import CompressPdfToSizeClient from "./CompressPdfToSizeClient";

export function generateStaticParams() {
  return compressPdfTargets.map((t) => ({ size: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ size: string }> }): Promise<Metadata> {
  const { size } = await params;
  const t = getCompressPdfTarget(size);
  if (!t) return {};
  return {
    title: `Compress PDF to ${t.label} Online Free`,
    description: `Compress a PDF to ${t.label} or under so it fits email and upload limits. Free, nothing uploaded, runs in your browser.`,
    alternates: { canonical: `https://iyonm.com/compress-pdf-to/${size}` },
  };
}

export default async function Page({ params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const t = getCompressPdfTarget(size);
  if (!t) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: `Compress PDF to ${t.label}`, applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `How do I compress a PDF to ${t.label}?`, acceptedAnswer: { "@type": "Answer", text: `Drop your PDF. We rerender and compress the pages until the file is at or under ${t.label}, then you download it.` } },
          { "@type": "Question", name: "Are my PDFs uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Everything runs in your browser. Your PDF never leaves your device." } },
          { "@type": "Question", name: "Will the text still be selectable?", acceptedAnswer: { "@type": "Answer", text: "To hit a small exact size, pages are rerendered as images, so text becomes part of the image. For email and upload limits this is usually fine." } },
        ],
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: `Compress PDF to ${t.label}`, item: `https://iyonm.com/compress-pdf-to/${size}` }] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressPdfToSizeClient target={t} />
    </>
  );
}
