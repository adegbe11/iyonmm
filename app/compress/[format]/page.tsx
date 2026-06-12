import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compressFormats, getCompressFormat } from "@/lib/seo-data";
import CompressFormatClient from "./CompressFormatClient";

export function generateStaticParams() {
  return compressFormats.map((f) => ({ format: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ format: string }> }): Promise<Metadata> {
  const { format } = await params;
  const f = getCompressFormat(format);
  if (!f) return {};
  return {
    title: `Compress ${f.name} Online Free, Reduce ${f.name} File Size`,
    description: `Compress ${f.name} images for free in your browser. ${f.blurb} Nothing uploaded, no limits, no signup.`,
    alternates: { canonical: `https://www.iyonm.com/compress/${format}` },
  };
}

export default async function Page({ params }: { params: Promise<{ format: string }> }) {
  const { format } = await params;
  const f = getCompressFormat(format);
  if (!f) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: `Compress ${f.name}`, applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `How do I compress a ${f.name} image?`, acceptedAnswer: { "@type": "Answer", text: `Drop your ${f.name} files, pick a quality level, and download the smaller versions. It all happens in your browser.` } },
          { "@type": "Question", name: `Are my ${f.name} files uploaded?`, acceptedAnswer: { "@type": "Answer", text: "No. Compression runs entirely in your browser. Your files never leave your device." } },
          { "@type": "Question", name: "Is it free?", acceptedAnswer: { "@type": "Answer", text: "Yes. Free, no limits, no signup." } },
        ],
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: `Compress ${f.name}`, item: `https://www.iyonm.com/compress/${format}` }] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressFormatClient format={f} />
    </>
  );
}
