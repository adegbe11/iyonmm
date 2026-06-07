"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface PdfFile { name: string; file: File; id: string }

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function MergePdfClient() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  function addFiles(newFiles: File[]) {
    const pdfs = newFiles.filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    setFiles((prev) => [...prev, ...pdfs.map((f) => ({ name: f.name, file: f, id: Math.random().toString(36).slice(2) }))]);
    setResultUrl(null);
  }

  function remove(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResultUrl(null);
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setFiles((prev) => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  }

  function moveDown(i: number) {
    setFiles((prev) => { if (i >= prev.length - 1) return prev; const a = [...prev]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });
  }

  async function merge() {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Failed to merge PDFs. Make sure all files are valid PDFs.");
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Merge PDF"
      subtitle="Combine multiple PDF files into a single document. Drag to reorder, everything runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: "Upload PDFs", desc: "Select multiple PDF files from your device." },
        { icon: "↕️", title: "Reorder", desc: "Drag or use arrows to set the page order." },
        { icon: "💾", title: "Download", desc: "Click Merge and download your combined PDF." },
      ]}
      faqs={[
        { q: "Are my PDFs uploaded to a server?", a: "No. Everything runs in your browser. Your files never leave your device." },
        { q: "How many PDFs can I merge?", a: "No limit, add as many PDFs as you need." },
        { q: "Will the merged PDF lose quality?", a: "No quality loss. pdf-lib copies pages exactly as they are." },
        { q: "Can I merge password-protected PDFs?", a: "Currently, only unprotected PDFs are supported. Unlock your PDF first using our Unlock PDF tool." },
      ]}
      related={[
        { label: "Split PDF", href: "/split-pdf" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "Remove Pages", href: "/remove-pages" },
        { label: "Rotate PDF", href: "/rotate-pdf" },
      ]}
    >
      <div>
        <DropZone accept="application/pdf,.pdf" multiple onFiles={addFiles} label="Select PDF files or drop them here" sublabel="Add as many files and pages as you want" />

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, i) => (
              <div key={f.id} className="card px-4 py-3 flex items-center gap-3">
                <span className="text-sm font-semibold w-6 text-center" style={{ color: "var(--apple-text-secondary)" }}>{i + 1}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#FF3B30" className="flex-shrink-0"><path d="M4 2h8l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /><path d="M12 2v4h4" fill="none" stroke="#FF6B60" strokeWidth="1.5" /></svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>{fmtSize(f.file.size)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveUp(i)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30" disabled={i === 0}>↑</button>
                  <button onClick={() => moveDown(i)} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30" disabled={i === files.length - 1}>↓</button>
                  <button onClick={() => remove(f.id)} className="p-1 rounded hover:bg-gray-100 text-red-500">✕</button>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              {!resultUrl ? (
                <button
                  onClick={merge}
                  disabled={files.length < 2 || processing}
                  className="btn-primary disabled:opacity-50"
                >
                  {processing ? "Merging..." : `Merge ${files.length} PDFs`}
                </button>
              ) : (
                <>
                  <a href={resultUrl} download="merged.pdf" className="btn-primary">Download merged.pdf</a>
                  <button onClick={() => { setFiles([]); setResultUrl(null); }} className="btn-secondary">Start over</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
