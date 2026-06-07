"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

type Pos = "bottom-center" | "bottom-right" | "bottom-left" | "top-center" | "top-right" | "top-left";

export default function PageNumbersClient() {
  const [file, setFile] = useState<File | null>(null);
  const [pos, setPos] = useState<Pos>("bottom-center");
  const [start, setStart] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function apply() {
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const label = String(start + i);
        const size = 11;
        const tw = font.widthOfTextAtSize(label, size);
        const margin = 28;
        let x = width / 2 - tw / 2;
        let y = margin;
        if (pos.includes("right")) x = width - margin - tw;
        if (pos.includes("left")) x = margin;
        if (pos.startsWith("top")) y = height - margin;
        page.drawText(label, { x, y, size, font, color: rgb(0.1, 0.1, 0.1) });
      });
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Failed to add page numbers.");
    }
    setProcessing(false);
  }

  const positions: { key: Pos; label: string }[] = [
    { key: "top-left", label: "Top Left" }, { key: "top-center", label: "Top Center" }, { key: "top-right", label: "Top Right" },
    { key: "bottom-left", label: "Bottom Left" }, { key: "bottom-center", label: "Bottom Center" }, { key: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <ToolShell
      title="Add Page Numbers to PDF"
      subtitle="Stamp page numbers onto every page. Choose the position and starting number. Runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the PDF to number." },
        { icon: "🔢", title: "Pick position", desc: "Choose where numbers appear and the start value." },
        { icon: "💾", title: "Download", desc: "Save your numbered PDF." },
      ]}
      faqs={[
        { q: "Where can numbers be placed?", a: "Any of six positions: top or bottom, left/center/right." },
        { q: "Can I start from a number other than 1?", a: "Yes. Set any starting number, useful for documents that continue from another file." },
        { q: "Are files uploaded?", a: "No. Numbering runs in your browser with pdf-lib." },
        { q: "Will it overwrite existing content?", a: "Numbers are drawn in the margin. On documents with content to the very edge, they may overlap." },
      ]}
      related={[
        { label: "Watermark PDF", href: "/watermark-pdf" },
        { label: "Merge PDF", href: "/merge-pdf" },
        { label: "Rotate PDF", href: "/rotate-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!file ? (
          <DropZone accept="application/pdf,.pdf" onFiles={(f) => { setFile(f[0]); setResultUrl(null); }} label="Select PDF file or drop PDF here" sublabel="Any size works" />
        ) : (
          <>
            <div className="card p-4 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#A855F7"><path d="M4 2h10l6 6v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /></svg>
              <p className="flex-1 text-sm font-medium">{file.name}</p>
              <button onClick={() => { setFile(null); setResultUrl(null); }} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <div className="p-5 rounded-2xl space-y-4" style={{ background: "var(--apple-gray)" }}>
              <div>
                <p className="text-sm font-medium mb-2">Position</p>
                <div className="grid grid-cols-3 gap-2">
                  {positions.map((p) => (
                    <button key={p.key} onClick={() => setPos(p.key)} className={`py-2 rounded-lg text-xs font-medium border ${pos === p.key ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>{p.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Start at</label>
                <input type="number" min={0} value={start} onChange={(e) => setStart(Number(e.target.value))} className="w-28 border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} />
              </div>
            </div>

            {!resultUrl ? (
              <button onClick={apply} disabled={processing} className="btn-primary disabled:opacity-50">{processing ? "Applying..." : "Add Page Numbers"}</button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">✅ Page numbers added</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download={file.name.replace(".pdf", "") + "-numbered.pdf"} className="btn-primary">Download PDF</a>
                  <button onClick={() => setResultUrl(null)} className="btn-secondary">Edit again</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
