import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resizePresets, getResizePreset } from "@/lib/seo-data";
import ResizeForClient from "./ResizeForClient";

export function generateStaticParams() {
  return resizePresets.map((p) => ({ preset: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ preset: string }> }): Promise<Metadata> {
  const { preset } = await params;
  const p = getResizePreset(preset);
  if (!p) return {};
  return {
    title: `Resize Image for ${p.name} (${p.width} x ${p.height}) Free`,
    description: `Resize any photo to ${p.width} x ${p.height} pixels for ${p.name}. Free, instant, nothing uploaded. ${p.note}`,
    alternates: { canonical: `https://iyonm.com/resize-image-for/${preset}` },
  };
}

export default async function Page({ params }: { params: Promise<{ preset: string }> }) {
  const { preset } = await params;
  const p = getResizePreset(preset);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: `Resize Image for ${p.name}`, applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `What size is a ${p.name} image?`, acceptedAnswer: { "@type": "Answer", text: `${p.name} images are ${p.width} x ${p.height} pixels. ${p.note}` } },
          { "@type": "Question", name: "Are my images uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Resizing runs entirely in your browser. Nothing is uploaded." } },
          { "@type": "Question", name: "Will my image be stretched?", acceptedAnswer: { "@type": "Answer", text: p.mode === "cover" ? "No. The image is scaled to fill and centered, then cropped to fit exactly, so it never looks stretched." : "No. The image is scaled to fit fully inside the dimensions with no distortion." } },
        ],
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: `Resize for ${p.name}`, item: `https://iyonm.com/resize-image-for/${preset}` }] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ResizeForClient preset={p} />
    </>
  );
}
