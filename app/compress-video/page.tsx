import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Compress Video Online Free, No Watermark (No Upload)",
  description: "Compress MP4, MOV, and WebM videos in your browser. No watermark, no signup, nothing uploaded. Shrink video size for email, web, and social.",
  alternates: { canonical: "https://www.iyonm.com/compress-video" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "Video Compressor", applicationCategory: "MultimediaApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Are my videos uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Compression runs entirely in your browser using ffmpeg.wasm. Your video never leaves your device." } },
      { "@type": "Question", name: "Is there a watermark?", acceptedAnswer: { "@type": "Answer", text: "No watermark, ever. The output is clean." } },
      { "@type": "Question", name: "Why is the first run slow?", acceptedAnswer: { "@type": "Answer", text: "The first run downloads the video engine (about 30MB) to your browser cache. After that it is much faster. Large videos still take time since all the work happens on your device." } },
    ] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: "Compress Video", item: "https://www.iyonm.com/compress-video" }] },
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
