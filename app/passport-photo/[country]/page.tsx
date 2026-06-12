import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { passportSpecs, getPassportSpec } from "@/lib/seo-data";
import PassportClient from "./PassportClient";

export function generateStaticParams() {
  return passportSpecs.map((p) => ({ country: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const p = getPassportSpec(country);
  if (!p) return {};
  return {
    title: `${p.country} Passport Photo Size Online Free`,
    description: `Make a ${p.country} passport photo at the official size (${p.physical}). Free, nothing uploaded, runs in your browser. Crop and resize in one click.`,
    alternates: { canonical: `https://www.iyonm.com/passport-photo/${country}` },
  };
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const p = getPassportSpec(country);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name: `${p.country} Passport Photo Maker`, applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `What size is a ${p.country} passport photo?`, acceptedAnswer: { "@type": "Answer", text: `A ${p.country} passport photo is ${p.physical}, which is ${p.width} x ${p.height} pixels at 300 DPI.` } },
          { "@type": "Question", name: "Are my photos uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Everything runs in your browser. Your photo never leaves your device." } },
          { "@type": "Question", name: "Is this an official photo service?", acceptedAnswer: { "@type": "Answer", text: "No. This tool resizes and crops your photo to the official dimensions. Always check current government requirements before submitting." } },
        ],
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: `${p.country} Passport Photo`, item: `https://www.iyonm.com/passport-photo/${country}` }] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PassportClient spec={p} />
    </>
  );
}
