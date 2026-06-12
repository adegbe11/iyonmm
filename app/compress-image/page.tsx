import type { Metadata } from "next";
import CompressImageClient from "./CompressImageClient";

export const metadata: Metadata = {
  title: "Compress Image Online Free, No Upload",
  description: "Compress JPEG, PNG, and WebP images for free. Files never leave your device. No upload, no limits, no signup required.",
  alternates: { canonical: "https://iyonm.com/compress-image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Image Compressor",
      applicationCategory: "UtilitiesApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Compress images client-side, nothing uploaded.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is image compression free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no limits." } },
        { "@type": "Question", name: "Are my images uploaded to a server?", acceptedAnswer: { "@type": "Answer", text: "No. All compression runs in your browser using the Canvas API. Your images never leave your device." } },
        { "@type": "Question", name: "What formats are supported?", acceptedAnswer: { "@type": "Answer", text: "JPEG, PNG, and WebP. More formats coming soon." } },
        { "@type": "Question", name: "Is there a file size limit?", acceptedAnswer: { "@type": "Answer", text: "No size limit. Process files as large as your device's memory allows." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" },
        { "@type": "ListItem", position: 2, name: "Compress Image", item: "https://iyonm.com/compress-image" },
      ],
    },
  ],
};

export default function CompressImagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CompressImageClient />
    </>
  );
}
