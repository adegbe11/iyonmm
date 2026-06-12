import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About IYONM - Free, Private, In-Browser Tools",
  description: "IYONM is It's Your Online No-upload Multitool: free PDF, image, video, and developer tools that run entirely in your browser. Nothing uploaded.",
  alternates: { canonical: "https://www.iyonm.com/about" },
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">About IYONM</h1>
      <div className="space-y-5 text-sm leading-relaxed" style={{ color: "var(--apple-text-secondary)" }}>
        <p><strong style={{ color: "var(--apple-black)" }}>IYONM</strong> stands for <strong style={{ color: "var(--apple-black)" }}>It&apos;s Your Online No-upload Multitool</strong>. It is a growing collection of free tools for PDFs, images, video, documents, and code that all run entirely in your web browser.</p>
        <p>Most online tools upload your files to a server to process them. We do the opposite: everything happens on your device. Your files never leave your computer, which makes IYONM faster and private by design.</p>
        <p>We believe useful tools should be free, instant, and free of friction. So there are no accounts, no file size limits, no watermarks, and no paywalls.</p>
        <p>We are always adding new tools. Check back often for more.</p>
        <p><Link href="/" className="font-semibold" style={{ color: "var(--apple-blue)" }}>Browse all tools →</Link></p>
      </div>
    </div>
  );
}
