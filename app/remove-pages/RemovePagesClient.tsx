"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function RemovePagesClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function loadFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setSelected(new Set());
    setResultUrl(null);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
  }

  function toggle(pg: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pg)) next.delete(pg); else next.add(pg);
      return next;
    });
    setResultUrl(null);
  }

  async function remove() {
    if (!file || selected.size === 0) return;
    if (selected.size >= pageCount) { alert("You cannot remove all pages."); return; }
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const keep = Array.from({ length: pageCount }, (_, i) => i).filter((i) => !selected.has(i + 1));
      const doc = await PDFDocument.create();
      const pages = await doc.copyPages(src, keep);
      pages.forEach((p) => doc.addPage(p));
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Failed to remove pages.");
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Remove Pages from PDF"
      subtitle="Select the pages you want to delete, then download the cleaned-up PDF. Runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the PDF to edit." },
        { icon: "🗑️", title: "Select pages", desc: "Click page numbers to mark them for removal." },
        { icon: "💾", title: "Download", desc: "Get your PDF with those pages removed." },
      ]}
      faqs={[
        { q: "Can I select multiple pages to remove?", a: "Yes. Click any number of pages to remove them all at once." },
        { q: "Will the remaining pages maintain quality?", a: "Yes. Pages are copied exactly without re-encoding." },
        { q: "Are files uploaded?", a: "No. Processing runs in your browser with pdf-lib." },
        { q: "Can I remove all pages?", a: "No. At least one page must remain in the PDF." },
      ]}
      related={[
        { label: "Split PDF", href: "/split-pdf" },
        { label: "Extract Pages", href: "/extract-pages" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!file ? (
          <DropZone accept="application/pdf,.pdf" onFiles={loadFile} label="Select PDF file or drop PDF here" sublabel="Any size works" />
        ) : (
          <>
            <div className="card p-4 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF3B30"><path d="M4 2h10l6 6v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /></svg>
              <div className="flex-1">
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>{pageCount} pages · {selected.size} selected for removal</p>
              </div>
              <button onClick={() => { setFile(null); setResultUrl(null); setSelected(new Set()); }} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => toggle(pg)}
                  className={`w-12 h-12 rounded-xl text-sm font-semibold border transition-all ${selected.has(pg) ? "bg-red-500 text-white border-red-500" : "border-[#D2D2D7] hover:border-[#673DE6]"}`}
                >
                  {pg}
                </button>
              ))}
            </div>
            {selected.size > 0 && <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Pages {[...selected].sort((a,b)=>a-b).join(", ")} will be removed. {pageCount - selected.size} pages will remain.</p>}

            {!resultUrl ? (
              <button onClick={remove} disabled={processing || selected.size === 0} className="btn-primary disabled:opacity-50">
                {processing ? "Processing..." : `Remove ${selected.size} page${selected.size !== 1 ? "s" : ""}`}
              </button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">✅ Pages removed</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download={file.name.replace(".pdf", "") + "-edited.pdf"} className="btn-primary">Download PDF</a>
                  <button onClick={() => { setResultUrl(null); setSelected(new Set()); }} className="btn-secondary">Edit again</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
