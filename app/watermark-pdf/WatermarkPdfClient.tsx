"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function WatermarkPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.3);
  const [color, setColor] = useState("#000000");
  const [angle, setAngle] = useState(45);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function apply() {
    if (!file || !text) return;
    setProcessing(true);
    try {
      const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity,
          rotate: degrees(angle),
        });
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Failed to add watermark.");
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Add Watermark to PDF"
      subtitle="Stamp any text on every page of your PDF. Customize font, color, opacity, and angle. Runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the PDF to watermark." },
        { icon: "✏️", title: "Customize", desc: "Enter your text and adjust size, color, and angle." },
        { icon: "💾", title: "Download", desc: "Save your watermarked PDF." },
      ]}
      faqs={[
        { q: "What text can I use as a watermark?", a: "Any text, CONFIDENTIAL, DRAFT, your name, or any custom string." },
        { q: "Can I control the watermark appearance?", a: "Yes. Adjust font size, color, opacity (transparency), and rotation angle." },
        { q: "Are files uploaded?", a: "No. Watermarking runs in your browser with pdf-lib." },
        { q: "Can I remove a watermark later?", a: "Watermarks added this way are embedded in the page content. They cannot be easily removed." },
      ]}
      related={[
        { label: "Protect PDF", href: "/protect-pdf" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!file ? (
          <DropZone accept="application/pdf,.pdf" onFiles={(f) => { setFile(f[0]); setResultUrl(null); }} label="Select PDF file or drop PDF here" sublabel="Any size works" />
        ) : (
          <>
            <div className="card p-4 flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF3B30"><path d="M4 2h10l6 6v14a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" /></svg>
              <p className="flex-1 text-sm font-medium">{file.name}</p>
              <button onClick={() => { setFile(null); setResultUrl(null); }} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <div className="p-5 rounded-2xl space-y-4" style={{ background: "var(--apple-gray)" }}>
              <div>
                <label className="text-sm font-medium block mb-1">Watermark text</label>
                <input value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} placeholder="CONFIDENTIAL" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Font size: {fontSize}px</label>
                  <input type="range" min={12} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-[#673DE6]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Opacity: {Math.round(opacity * 100)}%</label>
                  <input type="range" min={5} max={100} value={Math.round(opacity * 100)} onChange={(e) => setOpacity(Number(e.target.value) / 100)} className="w-full accent-[#673DE6]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Angle: {angle}°</label>
                  <input type="range" min={-90} max={90} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-full accent-[#673DE6]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Color</label>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer border-0" />
                </div>
              </div>
            </div>

            {!resultUrl ? (
              <button onClick={apply} disabled={processing || !text} className="btn-primary disabled:opacity-50">
                {processing ? "Applying..." : "Add Watermark"}
              </button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">✅ Watermark added</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download={file.name.replace(".pdf", "") + "-watermarked.pdf"} className="btn-primary">Download PDF</a>
                  <button onClick={() => setResultUrl(null)} className="btn-secondary">Edit watermark</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
