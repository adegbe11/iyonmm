"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function RotatePdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function loadFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(doc.getPageCount());
  }

  async function rotate() {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach((page) => {
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + angle) % 360));
      });
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Failed to rotate PDF.");
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Rotate PDF"
      subtitle="Fix page orientation in any PDF. Rotate all pages by 90, 180, or 270 degrees, runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the PDF with incorrect page orientation." },
        { icon: "🔄", title: "Choose angle", desc: "Rotate 90°, 180°, or 270° clockwise." },
        { icon: "💾", title: "Download", desc: "Get your corrected PDF instantly." },
      ]}
      faqs={[
        { q: "Can I rotate specific pages only?", a: "Currently all pages are rotated. Per-page rotation is coming soon." },
        { q: "Will rotating affect PDF quality?", a: "No. Rotation only changes the page orientation metadata, not the content." },
        { q: "Are my files uploaded?", a: "No. Rotation happens entirely in your browser with pdf-lib." },
        { q: "What if my PDF is already rotated?", a: "The new rotation is added to the existing rotation. Use 270° to undo a 90° rotation." },
      ]}
      related={[
        { label: "Merge PDF", href: "/merge-pdf" },
        { label: "Split PDF", href: "/split-pdf" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "Remove Pages", href: "/remove-pages" },
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
                <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>{pageCount} pages</p>
              </div>
              <button onClick={() => { setFile(null); setResultUrl(null); }} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Rotate all pages by:</p>
              <div className="flex gap-3">
                {([90, 180, 270] as const).map((deg) => (
                  <button key={deg} onClick={() => setAngle(deg)} className={`flex-1 py-3 rounded-xl text-sm font-medium border ${angle === deg ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>
                    {deg === 90 ? "90° Clockwise" : deg === 180 ? "180° Flip" : "270° (90° CCW)"}
                  </button>
                ))}
              </div>
            </div>

            {!resultUrl ? (
              <button onClick={rotate} disabled={processing} className="btn-primary disabled:opacity-50">
                {processing ? "Rotating..." : "Rotate PDF"}
              </button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">✅ Rotation complete</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download={file.name.replace(".pdf", "") + "-rotated.pdf"} className="btn-primary">Download PDF</a>
                  <button onClick={() => setResultUrl(null)} className="btn-secondary">Rotate again</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
