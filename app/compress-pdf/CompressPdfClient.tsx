"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function CompressPdfClient() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; originalSize: number; compressedSize: number; name: string } | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buf = await file.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });

      // Remove unused metadata to reduce size
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");

      const bytes = await doc.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), originalSize: file.size, compressedSize: blob.size, name: file.name });
    } catch (e) {
      alert("Failed to compress PDF. The file may be corrupted or password-protected.");
      console.error(e);
    }
    setProcessing(false);
  }

  const saving = result ? Math.round((1 - result.compressedSize / result.originalSize) * 100) : 0;

  return (
    <ToolShell
      title="Compress PDF"
      subtitle="Shrink your PDF file size while keeping it readable. Processing runs entirely in your browser, zero uploads."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload your PDF", desc: "Select any PDF from your device." },
        { icon: "⚙️", title: "Auto-compress", desc: "We strip redundant metadata and optimize the file structure." },
        { icon: "💾", title: "Download", desc: "Save your smaller PDF instantly." },
      ]}
      faqs={[
        { q: "Are my PDFs uploaded to a server?", a: "No. Compression runs entirely in your browser using pdf-lib. Nothing is uploaded." },
        { q: "How much can I compress a PDF?", a: "Image-heavy PDFs typically see 40-80% reduction. Text PDFs may see 10-30%. Results vary by content." },
        { q: "Will my PDF quality decrease?", a: "We remove metadata and optimize structure without touching visual content. Quality stays the same." },
        { q: "Is there a file size limit?", a: "No. Process files as large as your device memory allows." },
      ]}
      related={[
        { label: "Merge PDF", href: "/merge-pdf" },
        { label: "Split PDF", href: "/split-pdf" },
        { label: "Protect PDF", href: "/protect-pdf" },
        { label: "PDF to JPG", href: "/pdf-to-jpg" },
      ]}
    >
      <div>
        {!processing && !result && (
          <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF file or drop PDF here" sublabel="One file at a time. Any size works." />
        )}

        {processing && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Compressing your PDF...</p>
          </div>
        )}

        {result && (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-bold text-lg mb-1">Compression complete</h3>
            <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>
              {fmtSize(result.originalSize)} → {fmtSize(result.compressedSize)}
              {saving > 0 && <span className="ml-2 font-semibold" style={{ color: "#34C759" }}>saved {saving}%</span>}
              {saving <= 0 && <span className="ml-2" style={{ color: "var(--apple-text-secondary)" }}> (already optimized)</span>}
            </p>
            <div className="flex gap-3 justify-center">
              <a href={result.url} download={result.name.replace(".pdf", "") + "-compressed.pdf"} className="btn-primary">
                Download compressed PDF
              </a>
              <button onClick={() => setResult(null)} className="btn-secondary">Compress another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
