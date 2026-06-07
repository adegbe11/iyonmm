"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function Client() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string; pages: number } | null>(null);
  const [error, setError] = useState("");

  async function handle(files: File[]) {
    const f = files[0]; if (!f) return;
    setBusy(true); setError(""); setResult(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true, throwOnInvalidObject: false, updateMetadata: false });
      // Rebuild into a fresh document to drop broken objects.
      const out = await PDFDocument.create();
      const copied = await out.copyPages(doc, doc.getPageIndices());
      copied.forEach((p) => out.addPage(p));
      const data = await out.save();
      setResult({ url: URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })), name: f.name, pages: out.getPageCount() });
    } catch (e) {
      console.error(e);
      setError("This PDF is too damaged to rebuild automatically. The file may be only partially recoverable.");
    }
    setBusy(false);
  }

  return (
    <ToolShell title="Repair PDF" subtitle="Rebuild a damaged or corrupted PDF so it opens again. Runs in your browser, nothing uploaded." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Upload PDF", desc: "Select the damaged file." }, { icon: "🛠️", title: "Rebuild", desc: "We reconstruct the structure and drop broken parts." }, { icon: "💾", title: "Download", desc: "Save the repaired PDF." }]}
      faqs={[{ q: "Will it fix any PDF?", a: "It fixes many structural problems by rebuilding the file, but severely corrupted PDFs may only be partially recoverable." }, { q: "Are my files uploaded?", a: "No. The repair runs in your browser with pdf-lib." }, { q: "Will it recover deleted text?", a: "No. It recovers what is still present in the file, it cannot restore data that is truly gone." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "Compress PDF", href: "/compress-pdf" }, { label: "Merge PDF", href: "/merge-pdf" }, { label: "Unlock PDF", href: "/unlock-pdf" }]}>
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}
        {!result && !busy && <DropZone accept="application/pdf,.pdf" onFiles={handle} label="Select PDF file or drop PDF here" sublabel="Any size works" />}
        {busy && <div className="py-16 text-center"><div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" /><p className="text-sm">Rebuilding PDF...</p></div>}
        {result && (
          <div className="card p-6 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold mb-1">Rebuilt successfully</p>
            <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>{result.pages} page{result.pages !== 1 ? "s" : ""} recovered.</p>
            <div className="flex gap-3 justify-center"><a href={result.url} download={result.name.replace(/\.pdf$/i, "") + "-repaired.pdf"} className="btn-primary">Download repaired PDF</a><button onClick={() => setResult(null)} className="btn-secondary">Repair another</button></div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
