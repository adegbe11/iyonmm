import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compressTargets, getCompressTarget } from "@/lib/seo-data";
import CompressToSizeClient from "./CompressToSizeClient";

export function generateStaticParams() {
  return compressTargets.map((t) => ({ size: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ size: string }> }): Promise<Metadata> {
  const { size } = await params;
  const t = getCompressTarget(size);
  if (!t) return {};
  return {
    title: `Compress Image to ${t.label} Online Free`,
    description: `Compress a JPG, PNG, or WebP image to exactly ${t.label} or under. Free, nothing uploaded, works right in your browser. Perfect for forms and uploads.`,
    alternates: { canonical: `https://www.iyonm.com/compress-image-to/${size}` },
  };
}

export default async function Page({ params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const t = getCompressTarget(size);
  if (!t) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: `Compress Image to ${t.label}`, applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `How do I compress an image to ${t.label}?`, acceptedAnswer: { "@type": "Answer", text: `Drop your image, and we automatically lower the quality and size until the file is at or under ${t.label}. Then download it.` } },
          { "@type": "Question", name: "Are my images uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Everything runs in your browser. Your images never leave your device." } },
          { "@type": "Question", name: "What formats work?", acceptedAnswer: { "@type": "Answer", text: "JPG, PNG, and WebP images are all supported." } },
        ],
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: `Compress Image to ${t.label}`, item: `https://www.iyonm.com/compress-image-to/${size}` }] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressToSizeClient target={t} />
    </>
  );
}
