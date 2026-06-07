"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface Rect { x: number; y: number; w: number; h: number } // normalized 0-1
type RectMap = Record<number, Rect[]>;

export default function Client() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [idx, setIdx] = useState(0);
  const [pageImg, setPageImg] = useState("");
  const [rects, setRects] = useState<RectMap>({});
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [draftRect, setDraftRect] = useState<Rect | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  async function load(files: File[]) {
    const f = files[0]; if (!f) return;
    setFileName(f.name); setResultUrl(null); setRects({});
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
    const page = await pdf.getPage(i + 1);
    const vp = page.getViewport({ scale: 1.3 });
    const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: c.getContext("2d") as any, viewport: vp, canvas: c } as any).promise;
    setPageImg(c.toDataURL("image/jpeg", 0.8));
  }

  function rel(e: React.MouseEvent) { const r = imgRef.current!.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; }
  function down(e: React.MouseEvent) { drag.current = rel(e); }
  function move(e: React.MouseEvent) { if (!drag.current) return; const p = rel(e); const s = drag.current; setDraftRect({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) }); }
  function upE() { if (drag.current && draftRect && draftRect.w > 0.005 && draftRect.h > 0.005) { setRects((m) => ({ ...m, [idx]: [...(m[idx] || []), draftRect] })); } drag.current = null; setDraftRect(null); setResultUrl(null); }
  function clearPage() { setRects((m) => ({ ...m, [idx]: [] })); }

  async function goto(n: number) { if (!bytes) return; setIdx(n); await render(bytes, n); }

  async function apply() {
    if (!bytes) return; setBusy(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
      const out = await PDFDocument.create();
      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const vp = page.getViewport({ scale: 2 });
        const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
        const ctx = c.getContext("2d")!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx as any, viewport: vp, canvas: c } as any).promise;
        ctx.fillStyle = "#000";
        (rects[i] || []).forEach((r) => ctx.fillRect(r.x * c.width, r.y * c.height, r.w * c.width, r.h * c.height));
        const img = await out.embedJpg(c.toDataURL("image/jpeg", 0.85));
        const p = out.addPage([c.width, c.height]); p.drawImage(img, { x: 0, y: 0, width: c.width, height: c.height });
      }
      const data = await out.save();
      setResultUrl(URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })));
    } catch (e) { console.error(e); alert("Could not redact the PDF."); }
    setBusy(false);
  }

  const cur = rects[idx] || [];

  return (
    <ToolShell title="Redact PDF" subtitle="Draw boxes over sensitive text. We flatten the page so the hidden text is permanently removed, not just covered." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Upload PDF", desc: "View each page." }, { icon: "⬛", title: "Draw boxes", desc: "Click and drag over text to hide." }, { icon: "💾", title: "Download", desc: "Pages are flattened to images so text is gone." }]}
      faqs={[{ q: "Is the text really removed?", a: "Yes. On export, each page is rasterized to an image with the black boxes baked in, so the underlying text no longer exists in the file." }, { q: "Are my files uploaded?", a: "No. Everything runs in your browser." }, { q: "Will the PDF still have selectable text?", a: "No. Redacted output is image-based by design, which is what makes the redaction secure." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "Crop PDF", href: "/crop-pdf" }, { label: "Protect PDF", href: "/protect-pdf" }, { label: "Watermark PDF", href: "/watermark-pdf" }]}>
      <div>
        {!bytes ? <DropZone accept="application/pdf,.pdf" onFiles={load} label="Select PDF file or drop PDF here" sublabel="Any size works" /> : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">Drag over text to redact</p>
              <div className="flex items-center gap-2 text-sm">
                <button onClick={() => goto(Math.max(0, idx - 1))} disabled={idx === 0} className="px-2 disabled:opacity-30">‹</button>
                Page {idx + 1}/{numPages}
                <button onClick={() => goto(Math.min(numPages - 1, idx + 1))} disabled={idx === numPages - 1} className="px-2 disabled:opacity-30">›</button>
                {cur.length > 0 && <button onClick={clearPage} className="ml-2 text-xs" style={{ color: "#FF3B30" }}>Clear page</button>}
              </div>
            </div>
            <div className="relative inline-block w-full select-none" onMouseDown={down} onMouseMove={move} onMouseUp={upE} onMouseLeave={upE}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {pageImg && <img ref={imgRef} src={pageImg} alt={`Page ${idx + 1}`} draggable={false} className="w-full rounded-lg cursor-crosshair" style={{ border: "1px solid var(--apple-border)" }} />}
              {cur.map((r, k) => <div key={k} className="absolute" style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%`, width: `${r.w * 100}%`, height: `${r.h * 100}%`, background: "#000" }} />)}
              {draftRect && <div className="absolute" style={{ left: `${draftRect.x * 100}%`, top: `${draftRect.y * 100}%`, width: `${draftRect.w * 100}%`, height: `${draftRect.h * 100}%`, background: "rgba(0,0,0,0.6)", border: "1px dashed #673DE6" }} />}
            </div>
            <div className="mt-5 flex gap-3">
              {!resultUrl ? <button onClick={apply} disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Redacting..." : "Apply redactions"}</button> :
                <a href={resultUrl} download={fileName.replace(/\.pdf$/i, "") + "-redacted.pdf"} className="btn-primary">Download redacted PDF</a>}
              <button onClick={() => { setBytes(null); setRects({}); setResultUrl(null); }} className="btn-secondary">New file</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
