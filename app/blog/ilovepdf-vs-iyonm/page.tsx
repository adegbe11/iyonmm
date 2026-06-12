import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://www.iyonm.com";
const URL = `${SITE}/blog/ilovepdf-vs-iyonm`;

export const metadata: Metadata = {
  title: "iLovePDF vs IYONM: Every Tool Compared (2026)",
  description:
    "A complete, honest tool-by-tool comparison of iLovePDF and IYONM. See which PDF, image, and video tools each one has, who wins on privacy, limits, and price.",
  alternates: { canonical: URL },
  openGraph: { title: "iLovePDF vs IYONM: Every Tool Compared", description: "Honest tool-by-tool comparison. Privacy, limits, price, and which tools each platform has.", url: URL, type: "article" },
};

type Status = "match" | "better" | "partial" | "missing";
interface Row { ilp: string; tool?: { label: string; href: string }; note: string; status: Status }
interface Group { title: string; rows: Row[] }

const GROUPS: Group[] = [
  {
    title: "Organize PDF",
    rows: [
      { ilp: "Merge PDF", tool: { label: "Merge PDF", href: "/merge-pdf" }, note: "Combine any number of PDFs in your browser. No file count limit.", status: "better" },
      { ilp: "Split PDF", tool: { label: "Split PDF", href: "/split-pdf" }, note: "Split by range or extract every page. Fully local.", status: "better" },
      { ilp: "Remove pages", tool: { label: "Remove Pages", href: "/remove-pages" }, note: "Delete unwanted pages and download.", status: "better" },
      { ilp: "Extract pages", tool: { label: "Extract Pages", href: "/extract-pages" }, note: "Pull selected pages into a new PDF.", status: "better" },
      { ilp: "Organize PDF", tool: { label: "Organize PDF", href: "/organize-pdf" }, note: "Drag to reorder, rotate, and delete pages visually.", status: "better" },
      { ilp: "Scan to PDF", tool: { label: "Scan to PDF", href: "/scan-to-pdf" }, note: "Use your camera or combine photos into a PDF.", status: "match" },
    ],
  },
  {
    title: "Optimize PDF",
    rows: [
      { ilp: "Compress PDF", tool: { label: "Compress PDF", href: "/compress-pdf" }, note: "Shrink PDFs locally. Plus compress to an exact target size (100 KB, 200 KB, 1 MB).", status: "better" },
      { ilp: "Repair PDF", tool: { label: "Repair PDF", href: "/repair-pdf" }, note: "Rebuild a damaged PDF's structure.", status: "match" },
      { ilp: "OCR PDF", tool: { label: "OCR PDF", href: "/ocr-pdf" }, note: "Make scanned PDFs searchable with in-browser OCR (Tesseract).", status: "match" },
    ],
  },
  {
    title: "Convert to PDF",
    rows: [
      { ilp: "JPG to PDF", tool: { label: "Image to PDF", href: "/image-to-pdf" }, note: "Turn JPG, PNG, and more into a PDF.", status: "better" },
      { ilp: "WORD to PDF", tool: { label: "Word to PDF", href: "/word-to-pdf" }, note: "Convert .docx to PDF in your browser (mammoth).", status: "match" },
      { ilp: "EXCEL to PDF", tool: { label: "Excel to PDF", href: "/excel-to-pdf" }, note: "Convert spreadsheets to PDF locally.", status: "match" },
      { ilp: "POWERPOINT to PDF", note: "Not offered yet. Faithful .pptx rendering needs heavy layout work; on the roadmap.", status: "missing" },
      { ilp: "HTML to PDF", note: "Not offered as a standalone tool yet.", status: "missing" },
    ],
  },
  {
    title: "Convert from PDF",
    rows: [
      { ilp: "PDF to JPG", tool: { label: "PDF to JPG", href: "/pdf-to-jpg" }, note: "Render each page to an image. Also PDF to PNG.", status: "better" },
      { ilp: "PDF to WORD", tool: { label: "PDF to Word", href: "/pdf-to-word" }, note: "Extract to an editable .docx, fully local.", status: "match" },
      { ilp: "PDF to EXCEL", tool: { label: "PDF to Excel", href: "/pdf-to-excel" }, note: "Pull tables into a spreadsheet.", status: "match" },
      { ilp: "PDF to POWERPOINT", note: "Not offered. Editable slide reconstruction is a server-heavy task.", status: "missing" },
      { ilp: "PDF to PDF/A", note: "Archival PDF/A conversion not offered yet.", status: "missing" },
    ],
  },
  {
    title: "Edit PDF",
    rows: [
      { ilp: "Rotate PDF", tool: { label: "Rotate PDF", href: "/rotate-pdf" }, note: "Rotate any or all pages.", status: "match" },
      { ilp: "Add page numbers", tool: { label: "Page Numbers", href: "/page-numbers" }, note: "Insert page numbers with position options.", status: "match" },
      { ilp: "Add watermark", tool: { label: "Watermark PDF", href: "/watermark-pdf" }, note: "Stamp text or image watermarks.", status: "match" },
      { ilp: "Crop PDF", tool: { label: "Crop PDF", href: "/crop-pdf" }, note: "Trim margins visually.", status: "match" },
      { ilp: "Edit PDF", tool: { label: "Edit PDF", href: "/edit-pdf" }, note: "Add text anywhere, choose size and color.", status: "match" },
      { ilp: "PDF Forms", tool: { label: "Fill PDF Forms", href: "/pdf-to-form" }, note: "Fill and flatten form fields.", status: "match" },
    ],
  },
  {
    title: "PDF Security",
    rows: [
      { ilp: "Unlock PDF", tool: { label: "Unlock PDF", href: "/unlock-pdf" }, note: "Remove a known password locally. Your password never leaves the device.", status: "better" },
      { ilp: "Protect PDF", tool: { label: "Protect PDF", href: "/protect-pdf" }, note: "Add password encryption in your browser.", status: "better" },
      { ilp: "Sign PDF", tool: { label: "Sign PDF", href: "/sign-pdf" }, note: "Draw or type a signature and place it.", status: "match" },
      { ilp: "Redact PDF", tool: { label: "Redact PDF", href: "/redact-pdf" }, note: "True redaction that removes the underlying content.", status: "better" },
      { ilp: "Compare PDF", tool: { label: "Compare PDF", href: "/compare-pdf" }, note: "Line-by-line text diff of two PDFs.", status: "match" },
    ],
  },
];

const STATUS_META: Record<Status, { label: string; bg: string; fg: string }> = {
  match: { label: "Match", bg: "#EDE7FB", fg: "#673DE6" },
  better: { label: "IYONM wins", bg: "#EBF9EE", fg: "#1a7a33" },
  partial: { label: "Partial", bg: "#FFF7E6", fg: "#B26B00" },
  missing: { label: "Not yet", bg: "#FFF0F0", fg: "#c0271c" },
};

const IYONM_ONLY = [
  { label: "Compress PDF to exact size", href: "/compress-pdf-to/200kb" },
  { label: "PDF to Text", href: "/pdf-to-text" },
  { label: "PDF to Markdown", href: "/pdf-to-markdown" },
  { label: "Contract Risk Scanner", href: "/ai-legal-auditor" },
  { label: "Compress Image", href: "/compress-image" },
  { label: "Compress Image to size", href: "/compress-image-to/100kb" },
  { label: "Resize Image", href: "/resize-image" },
  { label: "Remove Background", href: "/remove-background" },
  { label: "AI Image Upscaler", href: "/image-upscaler" },
  { label: "Passport Photo Maker", href: "/passport-photo/us" },
  { label: "Compress Video", href: "/compress-video" },
  { label: "Video to GIF", href: "/video-to-gif" },
  { label: "QR Code Generator", href: "/qr-code-generator" },
  { label: "Regex Tester", href: "/regex-tester" },
  { label: "JSON Formatter", href: "/json-formatter" },
  { label: "Base64 Encode/Decode", href: "/base64" },
  { label: "JWT Decoder", href: "/jwt-decoder" },
  { label: "Hash Generator", href: "/hash-generator" },
  { label: "UUID Generator", href: "/uuid-generator" },
  { label: "Text Diff Checker", href: "/text-diff" },
];

const FAQS = [
  { q: "Is IYONM a free alternative to iLovePDF?", a: "Yes. Every IYONM tool is free with no signup, no watermarks, and no file size or task limits. iLovePDF restricts free users with daily task limits and pushes a paid plan for batch work." },
  { q: "What is the main difference between IYONM and iLovePDF?", a: "iLovePDF uploads your files to its servers to process them. IYONM processes everything inside your browser, so your files never leave your device. You can verify this in your browser's Network tab, where you will see 0 KB uploaded." },
  { q: "Does iLovePDF have tools IYONM does not?", a: "Yes, a few. iLovePDF currently offers PowerPoint conversion, HTML to PDF, PDF/A archival conversion, and AI summarize/translate features that IYONM does not have yet. These need heavy server-side processing." },
  { q: "Does IYONM have tools iLovePDF does not?", a: "Many. IYONM adds video compression, video to GIF, an AI image upscaler, background removal, exact-size compression, a passport photo maker, and a full developer suite (Regex, JSON, Base64, JWT, hashing) that iLovePDF does not offer." },
  { q: "Is IYONM safe for confidential or corporate documents?", a: "Because files are never uploaded, there is no server copy to leak and no data transfer to document under GDPR or HIPAA. That makes it well suited to legal, medical, and corporate use." },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: "iLovePDF vs IYONM: Every Tool Compared (2026)", author: { "@type": "Organization", name: "IYONM" }, publisher: { "@type": "Organization", name: "IYONM" }, mainEntityOfPage: URL, description: "A complete tool-by-tool comparison of iLovePDF and IYONM." },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: "iLovePDF vs IYONM", item: URL }] },
    ],
  };

  let total = 0, have = 0;
  GROUPS.forEach((g) => g.rows.forEach((r) => { total++; if (r.status !== "missing") have++; }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--apple-blue)" }}>Comparison</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">iLovePDF vs IYONM: every tool compared</h1>
        <p className="text-lg mb-8" style={{ color: "var(--apple-text-secondary)" }}>
          iLovePDF is the best known online PDF suite. IYONM is the private, no-upload alternative that runs every tool inside your browser. This is an honest, tool-by-tool comparison, including the handful of things iLovePDF still does that we do not.
        </p>

        {/* Verdict box */}
        <div className="rounded-2xl p-6 mb-10" style={{ background: "var(--apple-gray)" }}>
          <h2 className="text-lg font-bold mb-4">The short version</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><p className="font-semibold mb-1" style={{ color: "var(--apple-blue)" }}>IYONM</p><ul className="space-y-1" style={{ color: "var(--apple-text-secondary)" }}><li>Files never leave your device</li><li>No size limits, no task limits, no signup</li><li>Works offline after the first visit</li><li>Adds video, image AI, and developer tools</li></ul></div>
            <div><p className="font-semibold mb-1">iLovePDF</p><ul className="space-y-1" style={{ color: "var(--apple-text-secondary)" }}><li>Uploads files to its servers</li><li>Free tier is throttled; batch work needs a paid plan</li><li>Mobile and desktop apps</li><li>Has a few server-only conversions IYONM lacks</li></ul></div>
          </div>
        </div>

        {/* Headline comparison table */}
        <h2 className="text-2xl font-bold mb-4">At a glance</h2>
        <div className="overflow-x-auto mb-12">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--apple-border)" }}>
                <th className="text-left py-2 pr-3 font-semibold"></th>
                <th className="text-left py-2 px-3 font-semibold" style={{ color: "var(--apple-blue)" }}>IYONM</th>
                <th className="text-left py-2 pl-3 font-semibold">iLovePDF</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Where files are processed", "In your browser", "On their servers"],
                ["Files uploaded", "Never (0 KB)", "Yes, every file"],
                ["File size limit", "None (your RAM)", "Capped on free plan"],
                ["Daily task limit", "None", "Limited on free plan"],
                ["Works offline", "Yes (after first visit)", "No"],
                ["Watermarks", "Never", "On some free outputs"],
                ["Signup required", "No", "For full features"],
                ["Price", "100% free", "Free tier + paid plans"],
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--apple-border)" }}>
                  <td className="py-2.5 pr-3 font-medium">{r[0]}</td>
                  <td className="py-2.5 px-3" style={{ color: "#1a7a33" }}>{r[1]}</td>
                  <td className="py-2.5 pl-3" style={{ color: "var(--apple-text-secondary)" }}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Per-category breakdown */}
        <h2 className="text-2xl font-bold mb-2">Tool-by-tool breakdown</h2>
        <p className="text-sm mb-8" style={{ color: "var(--apple-text-secondary)" }}>IYONM matches or beats iLovePDF on {have} of its {total} core PDF tools. Here is every one.</p>

        {GROUPS.map((g) => (
          <section key={g.title} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{g.title}</h3>
            <div className="space-y-3">
              {g.rows.map((r, i) => {
                const s = STATUS_META[r.status];
                return (
                  <div key={i} className="rounded-2xl p-4" style={{ border: "1px solid var(--apple-border)" }}>
                    <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{r.ilp}</span>
                        {r.tool && <><span style={{ color: "var(--apple-text-secondary)" }}>→</span><Link href={r.tool.href} className="text-sm font-semibold hover:underline" style={{ color: "var(--apple-blue)" }}>{r.tool.label}</Link></>}
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: s.bg, color: s.fg }}>{s.label}</span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>{r.note}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Where iLovePDF wins */}
        <section className="mb-10 rounded-2xl p-6" style={{ background: "#FFF7E6" }}>
          <h2 className="text-xl font-bold mb-2">Where iLovePDF still wins (being honest)</h2>
          <p className="text-sm mb-3" style={{ color: "#7a5b00" }}>A fair comparison admits the gaps. iLovePDF currently does a few things IYONM does not:</p>
          <ul className="text-sm space-y-1.5" style={{ color: "#7a5b00" }}>
            <li><b>PowerPoint conversion</b> (to and from PDF), <b>HTML to PDF</b>, and <b>PDF/A</b> archival conversion. These need heavy server-side layout engines.</li>
            <li><b>AI summarize and translate</b> built in. IYONM keeps processing local, so cloud AI features are intentionally not bundled.</li>
            <li><b>Native mobile and desktop apps</b> and team accounts with saved workflows.</li>
          </ul>
        </section>

        {/* Where IYONM wins outright */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">Tools IYONM has that iLovePDF does not</h2>
          <p className="text-sm mb-5" style={{ color: "var(--apple-text-secondary)" }}>Beyond PDFs, IYONM is a full multitool. None of these require an upload either.</p>
          <div className="flex flex-wrap gap-2">
            {IYONM_ONLY.map((t) => (
              <Link key={t.href} href={t.href} className="text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)" }}>{t.label}</Link>
            ))}
          </div>
        </section>

        {/* Verify */}
        <section className="mb-12 rounded-2xl p-6" style={{ background: "#12141c" }}>
          <h2 className="text-xl font-bold mb-2 text-white">Don&apos;t take our word for it</h2>
          <p className="text-sm mb-4 text-white/70">The privacy difference is something you can verify yourself in ten seconds:</p>
          <ol className="text-sm space-y-2 text-white/85 list-decimal pl-5">
            <li>Open any IYONM tool and press <kbd className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: "rgba(255,255,255,0.1)" }}>F12</kbd> to open Developer Tools.</li>
            <li>Click the <b style={{ color: "#a98cff" }}>Network</b> tab.</li>
            <li>Drop in a file. You will see <b className="text-emerald-400">0 KB</b> uploaded. The same test on a cloud tool shows your whole file being sent.</li>
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">FAQ</h2>
          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <details key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--apple-gray)" }}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-sm">{f.q}</summary>
                <p className="px-5 pb-4 text-sm" style={{ color: "var(--apple-text-secondary)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="rounded-2xl p-6 text-center" style={{ background: "var(--apple-blue)" }}>
          <h2 className="text-xl font-bold text-white mb-2">Try the private alternative</h2>
          <p className="text-sm text-white/85 mb-5">Every tool, free, with nothing uploaded.</p>
          <Link href="/" className="inline-flex font-semibold px-6 py-3 rounded-xl" style={{ background: "white", color: "var(--apple-blue)" }}>Browse all IYONM tools</Link>
        </div>
      </article>
    </>
  );
}
