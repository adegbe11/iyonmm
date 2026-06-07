"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

function parseRange(input: string, total: number): number[] {
  const pages: number[] = [];
  const parts = input.split(",").map((s) => s.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= Math.min(b, total); i++) pages.push(i);
    } else {
      const n = Number(part);
      if (n >= 1 && n <= total) pages.push(n);
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b);
}

export default function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"all" | "range">("all");
  const [range, setRange] = useState("");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);

  async function loadFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResults([]);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
  }

  async function split() {
    if (!file) return;
    setProcessing(true);
    setResults([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const total = src.getPageCount();
      const pages = mode === "all" ? Array.from({ length: total }, (_, i) => i + 1) : parseRange(range, total);

      const out: { name: string; url: string }[] = [];
      if (mode === "all") {
        for (const pg of pages) {
          const doc = await PDFDocument.create();
          const [copied] = await doc.copyPages(src, [pg - 1]);
          doc.addPage(copied);
          const bytes = await doc.save();
          const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
          out.push({ name: `page-${pg}.pdf`, url: URL.createObjectURL(blob) });
        }
      } else {
        const doc = await PDFDocument.create();
        const copied = await doc.copyPages(src, pages.map((p) => p - 1));
        copied.forEach((p) => doc.addPage(p));
        const bytes = await doc.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
        out.push({ name: `pages-${range.replace(/\s/g, "")}.pdf`, url: URL.createObjectURL(blob) });
      }
      setResults(out);
    } catch (e) {
      alert("Failed to split PDF.");
      console.error(e);
    }
    setProcessing(false);
  }

  function downloadAll() {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name;
      a.click();
    });
  }

  return (
    <ToolShell
      title="Split PDF"
      subtitle="Extract all pages as separate files, or save a custom page range. Runs entirely in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the PDF you want to split." },
        { icon: "✂️", title: "Choose pages", desc: "Split all pages or enter a custom range like 1-3, 5." },
        { icon: "💾", title: "Download", desc: "Download individual pages or your custom range as a new PDF." },
      ]}
      faqs={[
        { q: "Can I extract specific pages?", a: "Yes. Enter a range like 2-5 or individual pages like 1,3,7 to extract exactly what you need." },
        { q: "Will the split PDFs maintain quality?", a: "Yes. Pages are copied exactly without re-encoding." },
        { q: "Are files uploaded?", a: "No. Splitting runs entirely in your browser. Nothing is sent to a server." },
        { q: "Is there a page limit?", a: "No. Split PDFs of any length." },
      ]}
      related={[
        { label: "Merge PDF", href: "/merge-pdf" },
        { label: "Remove Pages", href: "/remove-pages" },
        { label: "Extract Pages", href: "/extract-pages" },
        { label: "Compress PDF", href: "/compress-pdf" },
      ]}
    >
      <div>
        {!file && <DropZone accept="application/pdf,.pdf" onFiles={loadFile} label="Select PDF file or drop PDF here" sublabel="Any number of pages, any size" />}

        {file && (
          <div className="space-y-4">
            <div className="card p-4 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF3B30"><path d="M4 2h10l6 6v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /></svg>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>{pageCount} pages</p>
              </div>
              <button onClick={() => { setFile(null); setResults([]); }} className="ml-auto text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setMode("all")} className={`flex-1 py-3 rounded-xl text-sm font-medium border ${mode === "all" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>
                Split all pages ({pageCount})
              </button>
              <button onClick={() => setMode("range")} className={`flex-1 py-3 rounded-xl text-sm font-medium border ${mode === "range" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>
                Extract page range
              </button>
            </div>

            {mode === "range" && (
              <input
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#673DE6]"
                style={{ borderColor: "var(--apple-border)" }}
              />
            )}

            {results.length === 0 ? (
              <button onClick={split} disabled={processing || (mode === "range" && !range)} className="btn-primary disabled:opacity-50">
                {processing ? "Splitting..." : "Split PDF"}
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">{results.length} file{results.length > 1 ? "s" : ""} ready</p>
                  <div className="flex gap-2">
                    {results.length > 1 && <button onClick={downloadAll} className="btn-primary text-sm px-4 py-2">Download all</button>}
                    <button onClick={() => { setResults([]); }} className="btn-secondary text-sm px-4 py-2">Split again</button>
                  </div>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {results.map((r, i) => (
                    <div key={i} className="card px-4 py-3 flex items-center justify-between">
                      <p className="text-sm">{r.name}</p>
                      <a href={r.url} download={r.name} className="text-sm font-medium" style={{ color: "var(--apple-blue)" }}>Download</a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
