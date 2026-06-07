import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best iLovePDF Alternative, IYONM vs iLovePDF (Free, No Upload)",
  description: "Looking for an iLovePDF alternative? IYONM does the same PDF and image tools but processes everything in your browser, so your files are never uploaded. Free, no limits, no signup.",
  alternates: { canonical: "https://www.iyonm.com/ilovepdf-alternative" },
};

const rows: { feature: string; iyonm: string; ilovepdf: string }[] = [
  { feature: "Files uploaded to a server", iyonm: "Never, all in your browser", ilovepdf: "Yes, files are uploaded" },
  { feature: "Privacy", iyonm: "Files never leave your device", ilovepdf: "Files sent to and stored on servers" },
  { feature: "File size limit (free)", iyonm: "No limit", ilovepdf: "Limited on free plan" },
  { feature: "Daily task limit (free)", iyonm: "Unlimited", ilovepdf: "Limited on free plan" },
  { feature: "Signup required", iyonm: "No", ilovepdf: "Pushed for higher limits" },
  { feature: "Works offline after load", iyonm: "Yes, most tools", ilovepdf: "No, needs server" },
  { feature: "Speed", iyonm: "Instant, no upload wait", ilovepdf: "Waits for upload and download" },
  { feature: "Watermarks on output", iyonm: "None", ilovepdf: "Some tools and plans" },
  { feature: "Price", iyonm: "Free", ilovepdf: "Free tier plus paid plans" },
];

const tools = [
  { label: "Compress PDF", href: "/compress-pdf" },
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Split PDF", href: "/split-pdf" },
  { label: "PDF to JPG", href: "/pdf-to-jpg" },
  { label: "Word to PDF", href: "/word-to-pdf" },
  { label: "PDF to Word", href: "/pdf-to-word" },
  { label: "Compress Image", href: "/compress-image" },
  { label: "Remove Background", href: "/remove-background" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is IYONM a good iLovePDF alternative?", acceptedAnswer: { "@type": "Answer", text: "Yes. IYONM offers the same core PDF and image tools but runs everything in your browser, so your files are never uploaded. It is free with no size or task limits and no signup." } },
        { "@type": "Question", name: "What does IYONM stand for?", acceptedAnswer: { "@type": "Answer", text: "IYONM stands for It's Your Online No-upload Multitool. The name reflects the core difference: your files stay on your device." } },
        { "@type": "Question", name: "Is IYONM really free?", acceptedAnswer: { "@type": "Answer", text: "Yes. All tools are free with no file size limits, no daily task limits, and no account required." } },
        { "@type": "Question", name: "How is IYONM more private than iLovePDF?", acceptedAnswer: { "@type": "Answer", text: "iLovePDF uploads your files to its servers to process them. IYONM processes everything locally in your browser, so your documents never leave your device." } },
      ],
    },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: "iLovePDF Alternative", item: "https://www.iyonm.com/ilovepdf-alternative" }] },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "#EDE7FB", color: "var(--apple-blue)" }}>
          IYONM vs iLovePDF
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">The iLovePDF alternative that never uploads your files</h1>
        <p className="text-lg mb-6" style={{ color: "var(--apple-text-secondary)" }}>
          IYONM gives you the same PDF and image tools you know, but everything runs right in your browser. Your files stay on your device. No size limits, no task limits, no signup.
        </p>
        <p className="text-sm mb-8 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
          <strong>IYONM</strong> stands for <strong>It&apos;s Your Online No-upload Multitool</strong>. That is the whole idea: the work happens on your computer, not on a server you have to trust with your documents.
        </p>

        {/* Comparison table */}
        <div className="card overflow-hidden mb-10">
          <div className="grid grid-cols-3 text-sm font-semibold" style={{ background: "var(--apple-gray)" }}>
            <div className="p-4">Feature</div>
            <div className="p-4 text-center" style={{ color: "var(--apple-blue)" }}>IYONM</div>
            <div className="p-4 text-center">iLovePDF</div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-3 text-sm border-t" style={{ borderColor: "var(--apple-border)" }}>
              <div className="p-4 font-medium">{r.feature}</div>
              <div className="p-4 text-center flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                <span>{r.iyonm}</span>
              </div>
              <div className="p-4 text-center" style={{ color: "var(--apple-text-secondary)" }}>{r.ilovepdf}</div>
            </div>
          ))}
        </div>

        {/* The honest bit */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Where iLovePDF is still ahead</h2>
          <p className="text-sm mb-2" style={{ color: "var(--apple-text-secondary)" }}>
            We believe in being straight with you. iLovePDF is a mature product with a few things we are still building toward:
          </p>
          <ul className="text-sm space-y-1 list-disc pl-5" style={{ color: "var(--apple-text-secondary)" }}>
            <li>Server-side Office conversion can keep complex layouts more exact than in-browser conversion.</li>
            <li>iLovePDF has desktop and mobile apps. IYONM is web first.</li>
            <li>They have a longer track record and a larger tool count.</li>
          </ul>
          <p className="text-sm mt-3" style={{ color: "var(--apple-text-secondary)" }}>
            If your top priority is privacy, speed, and no limits, IYONM is the better pick. If you need pixel perfect Office conversion of complex documents, their server tools may suit you.
          </p>
        </div>

        {/* Try the tools */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Try the tools, no upload required</h2>
          <div className="flex flex-wrap gap-3">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)", border: "1px solid var(--apple-border)" }}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="ad-slot">Advertisement</div>
      </div>
    </>
  );
}
