"use client";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { tools } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";
import Logo from "@/components/Logo";

interface Item { label: string; href: string; icon: string }
interface Section { title: string; color: string; items: Item[] }

// Hand-curated, iLovePDF-style arrangement. Color is per-section so each column
// reads as a coherent group. Icons come from ToolIcon.
const SECTIONS: Section[] = [
  { title: "Organize PDF", color: "#FF5B47", items: [
    { label: "Merge PDF", href: "/merge-pdf", icon: "merge" },
    { label: "Split PDF", href: "/split-pdf", icon: "split" },
    { label: "Remove Pages", href: "/remove-pages", icon: "remove" },
    { label: "Extract Pages", href: "/extract-pages", icon: "extract" },
  ]},
  { title: "Optimize PDF", color: "#34C759", items: [
    { label: "Compress PDF", href: "/compress-pdf", icon: "compress" },
    { label: "Compress to Size", href: "/compress-pdf-to/200kb", icon: "compress" },
    { label: "OCR PDF", href: "/ocr-pdf", icon: "ocr" },
    { label: "Read on Mobile", href: "/pdf-reflow", icon: "ocr" },
  ]},
  { title: "Convert to PDF", color: "#FFB22C", items: [
    { label: "JPG to PDF", href: "/jpg-to-pdf", icon: "img2pdf" },
    { label: "Image to PDF", href: "/image-to-pdf", icon: "img2pdf" },
    { label: "Word to PDF", href: "/word-to-pdf", icon: "word" },
    { label: "Excel to PDF", href: "/excel-to-pdf", icon: "excel" },
  ]},
  { title: "Convert from PDF", color: "#FFB22C", items: [
    { label: "PDF to JPG", href: "/pdf-to-jpg", icon: "pdf2img" },
    { label: "PDF to PNG", href: "/pdf-to-png", icon: "pdf2img" },
    { label: "PDF to Word", href: "/pdf-to-word", icon: "word" },
    { label: "PDF to Excel", href: "/pdf-to-excel", icon: "excel" },
    { label: "PDF to Markdown", href: "/pdf-to-markdown", icon: "word" },
  ]},
  { title: "Edit PDF", color: "#A855F7", items: [
    { label: "Rotate PDF", href: "/rotate-pdf", icon: "rotate" },
    { label: "Page Numbers", href: "/page-numbers", icon: "pagenum" },
    { label: "Watermark PDF", href: "/watermark-pdf", icon: "watermark" },
    { label: "Sign PDF", href: "/sign-pdf", icon: "watermark" },
    { label: "Fill PDF Forms", href: "/pdf-to-form", icon: "extract" },
  ]},
  { title: "PDF Security", color: "#5856D6", items: [
    { label: "Protect PDF", href: "/protect-pdf", icon: "lock" },
    { label: "Unlock PDF", href: "/unlock-pdf", icon: "unlock" },
  ]},
  { title: "PDF Intelligence", color: "#5856D6", items: [
    { label: "Contract Risk Scanner", href: "/ai-legal-auditor", icon: "ocr" },
  ]},
  { title: "Image Tools", color: "#FF2D92", items: [
    { label: "Compress Image", href: "/compress-image", icon: "compressimg" },
    { label: "Resize Image", href: "/resize-image", icon: "resize" },
    { label: "Remove Background", href: "/remove-background", icon: "magic" },
    { label: "AI Image Upscaler", href: "/image-upscaler", icon: "magic" },
    { label: "HEIC to JPG", href: "/convert/heic-to-jpg", icon: "convertimg" },
    { label: "All Converters", href: "/convert/png-to-jpg", icon: "convertimg" },
  ]},
  { title: "Video", color: "#FF2D92", items: [
    { label: "Compress Video", href: "/compress-video", icon: "compress" },
    { label: "Video to GIF", href: "/video-to-gif", icon: "convertimg" },
  ]},
  { title: "Calculators", color: "#34C759", items: [
    { label: "Calculator", href: "/calculator", icon: "pagenum" },
    { label: "Percentage", href: "/percentage-calculator", icon: "pagenum" },
    { label: "Age", href: "/age-calculator", icon: "pagenum" },
    { label: "Loan", href: "/loan-calculator", icon: "pagenum" },
    { label: "Unit Converter", href: "/unit-converter", icon: "convertimg" },
  ]},
  { title: "Widgets", color: "#1D1D1F", items: [
    { label: "QR Code Generator", href: "/qr-code-generator", icon: "split" },
    { label: "Timer", href: "/timer", icon: "rotate" },
    { label: "Stopwatch", href: "/stopwatch", icon: "rotate" },
  ]},
  { title: "Developer", color: "#2B7BF3", items: [
    { label: "Word Counter", href: "/word-counter", icon: "ocr" },
    { label: "JSON Formatter", href: "/json-formatter", icon: "extract" },
    { label: "Regex Tester", href: "/regex-tester", icon: "extract" },
    { label: ".env Validator", href: "/env-validator", icon: "lock" },
  ]},
];

const CONVERT = SECTIONS.filter((s) => s.title.startsWith("Convert"));

function Column({ sec, close }: { sec: Section; close: () => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2.5" style={{ color: "var(--apple-text-secondary)" }}>{sec.title}</p>
      <ul className="space-y-0.5">
        {sec.items.map((it) => (
          <li key={it.href + it.label}>
            <Link href={it.href} onClick={close} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors group">
              <ToolIcon icon={it.icon} color={sec.color} size={26} />
              <span className="text-sm group-hover:text-[#673DE6] transition-colors whitespace-nowrap" style={{ color: "var(--apple-black)" }}>{it.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState<"" | "all" | "convert">("");
  const [mobile, setMobile] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return tools.filter((t) => t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)).slice(0, 24);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") { setOpen(""); setMobile(false); } }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => { setOpen(""); setQuery(""); };

  return (
    <header style={{ borderBottom: "1px solid var(--apple-border)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}
      onMouseLeave={() => setOpen("")}>
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center flex-shrink-0" onClick={close} aria-label="IYONM home">
          <Logo size={22} />
        </Link>

        <div className="hidden md:flex items-center gap-1 flex-1">
          <Link href="/merge-pdf" onClick={close} className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F5F5F7]" style={{ color: "var(--apple-black)" }}>Merge PDF</Link>
          <Link href="/split-pdf" onClick={close} className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F5F5F7]" style={{ color: "var(--apple-black)" }}>Split PDF</Link>
          <Link href="/compress-pdf" onClick={close} className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F5F5F7]" style={{ color: "var(--apple-black)" }}>Compress PDF</Link>
          <button onMouseEnter={() => setOpen("convert")} onClick={() => setOpen(open === "convert" ? "" : "convert")} className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F5F5F7] flex items-center gap-1" style={{ color: open === "convert" ? "var(--apple-blue)" : "var(--apple-black)" }}>
            Convert <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" style={{ transform: open === "convert" ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 8L2 4h8z" /></svg>
          </button>
          <button onMouseEnter={() => setOpen("all")} onClick={() => setOpen(open === "all" ? "" : "all")} className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-[#F5F5F7] flex items-center gap-1" style={{ color: open === "all" ? "var(--apple-blue)" : "var(--apple-black)" }}>
            All Tools <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" style={{ transform: open === "all" ? "rotate(180deg)" : "none", transition: "transform .2s" }}><path d="M6 8L2 4h8z" /></svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#EDE7FB", color: "var(--apple-blue)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
            Nothing uploaded
          </span>
          <Link href="/compress-pdf" onClick={close} className="btn-primary text-sm" style={{ padding: "8px 18px" }}>Get started</Link>
        </div>

        <button className="md:hidden p-2 -mr-2" onClick={() => setMobile((v) => !v)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">{mobile ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /> : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />}</svg>
        </button>
      </nav>

      {/* Convert dropdown (focused, two columns like iLovePDF) */}
      {open === "convert" && (
        <div className="hidden md:block absolute left-0 right-0 top-full">
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <div className="rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-8 w-fit" style={{ background: "white", border: "1px solid var(--apple-border)" }}>
              {CONVERT.map((s) => <Column key={s.title} sec={s} close={close} />)}
            </div>
          </div>
        </div>
      )}

      {/* All Tools mega (wide, well-arranged columns) */}
      {open === "all" && (
        <div className="hidden md:block absolute left-0 right-0 top-full">
          <div className="mx-auto max-w-7xl px-4 pb-4">
            <div className="rounded-2xl shadow-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--apple-border)" }}>
              <div className="p-4" style={{ borderBottom: "1px solid var(--apple-border)" }}>
                <div className="relative max-w-md">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                  <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all tools..." className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none focus:border-[#673DE6]" style={{ border: "1px solid var(--apple-border)", background: "var(--apple-gray)" }} />
                </div>
              </div>
              <div className="p-6 max-h-[72vh] overflow-y-auto">
                {filtered ? (
                  filtered.length ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      {filtered.map((t) => (
                        <Link key={t.href} href={t.href} onClick={close} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F7]">
                          <ToolIcon icon={t.icon} color={t.color} size={30} />
                          <span className="text-sm font-medium" style={{ color: "var(--apple-black)" }}>{t.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : <p className="text-sm py-8 text-center" style={{ color: "var(--apple-text-secondary)" }}>No tools match “{query}”.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-6">
                    {SECTIONS.map((s) => <Column key={s.title} sec={s} close={close} />)}
                  </div>
                )}
              </div>
              <div className="px-6 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs font-medium" style={{ background: "var(--apple-gray)", color: "var(--apple-text-secondary)" }}>
                <span>🔒 Files never leave your device</span>
                <span>♾️ No size limits</span>
                <span>✨ No signup</span>
                <Link href="/ilovepdf-alternative" onClick={close} className="hover:underline" style={{ color: "var(--apple-blue)" }}>Why IYONM vs iLovePDF →</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile */}
      {mobile && (
        <div className="md:hidden" style={{ background: "white", borderTop: "1px solid var(--apple-border)", maxHeight: "calc(100vh - 56px)", overflowY: "auto" }}>
          <div className="p-4">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all tools..." className="w-full px-4 py-2.5 text-sm rounded-xl outline-none mb-4" style={{ border: "1px solid var(--apple-border)", background: "var(--apple-gray)" }} />
            {filtered ? (
              <div className="grid grid-cols-1 gap-1">
                {filtered.map((t) => (
                  <Link key={t.href} href={t.href} onClick={() => { setMobile(false); setQuery(""); }} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "var(--apple-gray)" }}>
                    <ToolIcon icon={t.icon} color={t.color} size={28} /><span className="text-sm font-medium" style={{ color: "var(--apple-black)" }}>{t.label}</span>
                  </Link>
                ))}
              </div>
            ) : SECTIONS.map((s) => (
              <div key={s.title} className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--apple-text-secondary)" }}>{s.title}</p>
                <div className="grid grid-cols-1 gap-1">
                  {s.items.map((it) => (
                    <Link key={it.href + it.label} href={it.href} onClick={() => { setMobile(false); setQuery(""); }} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "var(--apple-gray)" }}>
                      <ToolIcon icon={it.icon} color={s.color} size={28} /><span className="text-sm font-medium" style={{ color: "var(--apple-black)" }}>{it.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/compress-pdf" onClick={() => setMobile(false)} className="btn-primary w-full justify-center mt-2">Get started</Link>
          </div>
        </div>
      )}
    </header>
  );
}
