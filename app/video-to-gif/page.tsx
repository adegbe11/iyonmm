import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Video to GIF Converter, Free & No Watermark",
  description: "Convert MP4, MOV, or WebM video to a high-quality GIF in your browser. No watermark, no signup, nothing uploaded. Trim, set FPS and width.",
  alternates: { canonical: "https://www.iyonm.com/video-to-gif" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "Video to GIF", applicationCategory: "MultimediaApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Is there a watermark?", acceptedAnswer: { "@type": "Answer", text: "No. The GIF is clean, with no watermark." } },
      { "@type": "Question", name: "Are my videos uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Conversion runs in your browser with ffmpeg.wasm. Nothing leaves your device." } },
      { "@type": "Question", name: "How do I keep the GIF small?", acceptedAnswer: { "@type": "Answer", text: "Lower the width and FPS, and keep the clip short. GIFs grow quickly with size and frame rate." } },
    ] },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: "Video to GIF", item: "https://www.iyonm.com/video-to-gif" }] },
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
