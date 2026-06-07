import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "IyonM, Free PDF and Image Tools. Nothing Uploaded. No Limits.",
  description: "Compress, merge, split, convert PDFs and images, free, fast, private. Every file stays on your device. No upload, no limits, no account needed.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "IyonM",
  url: "https://iyonm.com",
  description: "Free PDF & image tools. Nothing uploaded. No limits. No signup.",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeClient />
    </>
  );
}
