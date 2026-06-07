"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface Anno { page: number; nx: number; ny: number; text: string; size: number; color: string }

function hexToRgb(h: string) { const n = parseInt(h.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; }

export default function Client() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [idx, setIdx] = useState(0);
  const [img, setImg] = useState("");
  const [annos, setAnnos] = useState<Anno[]>([]);
  const [text, setText] = useState("");
  const [size, setSize] = useState(16);
  const [color, setColor] = useState("#673DE6");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  async function load(files: File[]) {
    const f = files[0]; if (!f) return;
    setFileName(f.name); setResultUrl(null); setAnnos([]);
    const buf = await f.arrayBuffer(); setBytes(buf);
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    setNumPages(pdf.numPages); setIdx(0); await render(buf, 0);
  }
  async function render(buf: ArrayBuffer, i: number) {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const page = await pdf.getPage(i + 1); const vp = page.getViewport({ scale: 1.3 });
    const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: c.getContext("2d") as any, viewport: vp, canvas: c } as any).promise;
    setImg(c.toDataURL("image/jpeg", 0.8));
  }
  async function goto(n: number) { if (!bytes) return; setIdx(n); await render(bytes, n); }

  function place(e: React.MouseEvent<HTMLImageElement>) {
    if (!text.trim()) { alert("Type your text first, then click on the page to place it."); return; }
    const r = e.currentTarget.getBoundingClientRect();
    setAnnos((a) => [...a, { page: idx, nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height, text, size, color }]);
    setResultUrl(null);
  }
  function removeAnno(i: number) { setAnnos((a) => a.filter((_, k) => k !== i)); setResultUrl(null); }

  async function apply() {
    if (!bytes) return; setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      for (const a of annos) {
        const page = pages[a.page]; const { width, height } = page.getSize();
        const cc = hexToRgb(a.color);
        page.drawText(a.text, { x: a.nx * width, y: (1 - a.ny) * height - a.size, size: a.size, font, color: rgb(cc.r, cc.g, cc.b) });
      }
      const data = await doc.save();
      setResultUrl(URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })));
    } catch (e) { console.error(e); alert("Could not save the PDF."); }
    setBusy(false);
  }

  const cur = annos.filter((a) => a.page === idx);

  return (
    <ToolShell title="Edit PDF" subtitle="Add text anywhere on a PDF, pick the size and color, then download. Runs in your browser, nothing uploaded." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Upload PDF", desc: "View each page." }, { icon: "✍️", title: "Type & click", desc: "Enter text, then click where it goes." }, { icon: "💾", title: "Download", desc: "Save your edited PDF." }]}
      faqs={[{ q: "Are my files uploaded?", a: "No. Editing runs in your browser with pdf-lib." }, { q: "Can I edit existing text?", a: "This tool adds new text on top. Changing existing text in place is not supported, since PDFs store text as fixed layout." }, { q: "Can I add text to any page?", a: "Yes, navigate pages and place text on each." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "Sign PDF", href: "/sign-pdf" }, { label: "Fill PDF Forms", href: "/pdf-to-form" }, { label: "Watermark PDF", href: "/watermark-pdf" }]}>
      <div>
        {!bytes ? <DropZone accept="application/pdf,.pdf" onFiles={load} label="Select PDF file or drop PDF here" sublabel="Any size works" /> : (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3 p-3 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to add" className="flex-1 min-w-[160px] border rounded-lg px-3 py-2 text-sm" style={{ borderColor: "var(--apple-border)" }} />
              <label className="text-sm flex items-center gap-1">Size<input type="number" min={6} max={72} value={size} onChange={(e) => setSize(+e.target.value)} className="w-16 border rounded-lg px-2 py-1.5" style={{ borderColor: "var(--apple-border)" }} /></label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-9 rounded cursor-pointer border-0" />
            </div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span style={{ color: "var(--apple-text-secondary)" }}>{text.trim() ? "Click on the page to place text" : "Type text above first"}</span>
              {numPages > 1 && <span className="flex items-center gap-2"><button onClick={() => goto(Math.max(0, idx - 1))} disabled={idx === 0} className="px-2 disabled:opacity-30">‹</button>Page {idx + 1}/{numPages}<button onClick={() => goto(Math.min(numPages - 1, idx + 1))} disabled={idx === numPages - 1} className="px-2 disabled:opacity-30">›</button></span>}
            </div>
            <div className="relative inline-block w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {img && <img ref={imgRef} src={img} alt={`Page ${idx + 1}`} onClick={place} className="w-full rounded-lg cursor-text" style={{ border: "1px solid var(--apple-border)" }} />}
              {cur.map((a, k) => (
                <span key={k} onClick={() => removeAnno(annos.indexOf(a))} title="Click to remove" className="absolute cursor-pointer whitespace-nowrap" style={{ left: `${a.nx * 100}%`, top: `${a.ny * 100}%`, color: a.color, fontSize: `${a.size * 1.3}px`, lineHeight: 1, fontFamily: "Helvetica, Arial, sans-serif" }}>{a.text}</span>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              {!resultUrl ? <button onClick={apply} disabled={busy || !annos.length} className="btn-primary disabled:opacity-50">{busy ? "Saving..." : "Apply & Save"}</button> :
                <a href={resultUrl} download={fileName.replace(/\.pdf$/i, "") + "-edited.pdf"} className="btn-primary">Download PDF</a>}
              <button onClick={() => { setBytes(null); setAnnos([]); setResultUrl(null); }} className="btn-secondary">New file</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
