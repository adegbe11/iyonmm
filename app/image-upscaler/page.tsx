import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "AI Image Upscaler, Free 4x Photo Enhancer (No Upload)",
  description: "Upscale and sharpen blurry photos up to 4x with an AI model that runs in your browser. Free, no signup, no watermark, nothing uploaded.",
  alternates: { canonical: "https://iyonm.com/image-upscaler" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "AI Image Upscaler", applicationCategory: "MultimediaApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Is the upscaler really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. It uses an open-source AI model that runs in your browser. No signup, no watermark, no upload." } },
      { "@type": "Question", name: "Are my photos uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. The AI runs on your device. Your photo never leaves your browser." } },
      { "@type": "Question", name: "Why is it slow on big images?", acceptedAnswer: { "@type": "Answer", text: "Upscaling is heavy AI work done on your device. The first run also downloads the model. Smaller images finish faster." } },
    ] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name: "AI Image Upscaler", item: "https://iyonm.com/image-upscaler" }] },
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
