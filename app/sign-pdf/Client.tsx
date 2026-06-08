"use client";
import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface Placement { page: number; nx: number; ny: number }

export default function Client() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [pagePng, setPagePng] = useState("");
  const [pageDims, setPageDims] = useState({ w: 0, h: 0 });
  const [sigPng, setSigPng] = useState("");
  const [sigAspect, setSigAspect] = useState(3);
  const [sigSize, setSigSize] = useState(180);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const padRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  // --- load PDF + render current page ---
  async function loadFile(files: File[]) {
    const f = files[0]; if (!f) return;
    setError(""); setResultUrl(null); setPlacement(null);
    try {
      const buf = await f.arrayBuffer();
      setBytes(buf); setFileName(f.name);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      setNumPages(pdf.numPages); setPageIdx(0);
      await renderPage(buf, 0);
    } catch (e) { console.error(e); setError("Could not read that PDF."); }
  }

  async function renderPage(buf: ArrayBuffer, idx: number) {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const page = await pdf.getPage(idx + 1);
    const vp = page.getViewport({ scale: 1.4 });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width; canvas.height = vp.height;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: canvas.getContext("2d") as any, viewport: vp, canvas } as any).promise;
    setPagePng(canvas.toDataURL("image/png"));
    const base = page.getViewport({ scale: 1 });
    setPageDims({ w: base.width, h: base.height });
  }

  useEffect(() => { if (bytes) renderPage(bytes, pageIdx); /* eslint-disable-next-line */ }, [pageIdx]);

  // --- signature pad ---
  useEffect(() => {
    const c = padRef.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.strokeStyle = "#0b1f33";
  }, [mode]);

  function pos(e: React.PointerEvent) {
    const c = padRef.current!; const r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
  }
  function down(e: React.PointerEvent) { drawing.current = true; const ctx = padRef.current!.getContext("2d")!; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
  function move(e: React.PointerEvent) { if (!drawing.current) return; const ctx = padRef.current!.getContext("2d")!; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); dirty.current = true; }
  function up() { drawing.current = false; }
  function clearPad() { const c = padRef.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); dirty.current = false; setSigPng(""); }

  function useDrawn() {
    if (!dirty.current) { setError("Draw your signature first."); return; }
    const c = padRef.current!;
    setSigPng(c.toDataURL("image/png")); setSigAspect(c.width / c.height); setError("");
  }

  function useTyped() {
    if (!typed.trim()) { setError("Type your name first."); return; }
    const c = document.createElement("canvas"); c.width = 600; c.height = 200;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0b1f33"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
    ctx.font = "72px 'Brush Script MT', 'Segoe Script', cursive";
    ctx.fillText(typed, 300, 110);
    setSigPng(c.toDataURL("image/png")); setSigAspect(c.width / c.height); setError("");
  }

  function placeAt(e: React.MouseEvent<HTMLImageElement>) {
    if (!sigPng) { setError("Create a signature first."); return; }
    const r = e.currentTarget.getBoundingClientRect();
    setPlacement({ page: pageIdx, nx: (e.clientX - r.left) / r.width, ny: (e.clientY - r.top) / r.height });
    setResultUrl(null);
  }

  async function apply() {
    if (!bytes || !sigPng || !placement) { setError("Create a signature and click on the page to place it."); return; }
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(bytes);
      const png = await doc.embedPng(sigPng);
      const page = doc.getPages()[placement.page];
      const { width, height } = page.getSize();
      const w = sigSize; const h = w / sigAspect;
      const x = placement.nx * width - w / 2;
      const y = (1 - placement.ny) * height - h / 2;
      page.drawImage(png, { x, y, width: w, height: h });
      const out = await doc.save();
      setResultUrl(URL.createObjectURL(new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" })));
      setError("");
    } catch (e) { console.error(e); setError("Could not sign the PDF."); }
  }

  return (
    <ToolShell
      title="Sign PDF"
      subtitle="Draw or type your signature, click where it goes, and download the signed PDF. Everything runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the document to sign." },
        { icon: "✍️", title: "Make your signature", desc: "Draw it or type your name in a signature font." },
        { icon: "👆", title: "Place & download", desc: "Click on the page to drop it, then download." },
      ]}
      faqs={[
        { q: "Are my documents uploaded?", a: "No. Signing happens entirely in your browser. Your PDF never leaves your device." },
        { q: "Can I draw or type?", a: "Both. Draw with mouse or finger, or type your name in a signature font." },
        { q: "Is it legally valid?", a: "Simple e-signatures are widely accepted, but rules vary by country and document. Check local requirements for important contracts." },
        { q: "Can I sign multiple pages?", a: "Place and apply on one page, then download and re-upload to sign another, or place again on a different page before applying." },
      ]}
      related={[{ label: "Fill PDF Forms", href: "/pdf-to-form" }, { label: "Protect PDF", href: "/protect-pdf" }, { label: "Watermark PDF", href: "/watermark-pdf" }]}
    >
      <div>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}

        {!bytes ? (
          <DropZone accept="application/pdf,.pdf" onFiles={loadFile} label="Select PDF file or drop PDF here" sublabel="Any size works" />
        ) : (
          <div className="space-y-5">
            {/* Signature builder */}
            <div className="card p-5">
              <div className="flex gap-2 mb-3">
                <button onClick={() => setMode("draw")} className={`px-4 py-1.5 rounded-full text-sm border ${mode === "draw" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Draw</button>
                <button onClick={() => setMode("type")} className={`px-4 py-1.5 rounded-full text-sm border ${mode === "type" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Type</button>
              </div>
              {mode === "draw" ? (
                <>
                  <canvas ref={padRef} width={600} height={180} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}
                    className="w-full rounded-xl touch-none" style={{ border: "1px dashed var(--apple-border)", background: "var(--apple-gray)", maxWidth: 600 }} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={useDrawn} className="btn-primary text-sm px-4 py-1.5">Use signature</button>
                    <button onClick={clearPad} className="btn-secondary text-sm px-4 py-1.5">Clear</button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 items-center flex-wrap">
                  <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Your name" className="flex-1 border rounded-xl px-4 py-2.5 text-sm" style={{ borderColor: "var(--apple-border)", fontFamily: "'Brush Script MT','Segoe Script',cursive", fontSize: 24 }} />
                  <button onClick={useTyped} className="btn-primary text-sm px-4 py-2">Use signature</button>
                </div>
              )}
              {sigPng && (
                <div className="mt-3 flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sigPng} alt="signature" className="h-12 bg-white rounded border" style={{ borderColor: "var(--apple-border)" }} />
                  <label className="text-sm flex-1">Size: {sigSize}pt<input type="range" min={60} max={400} value={sigSize} onChange={(e) => setSigSize(+e.target.value)} className="w-full accent-[#673DE6]" /></label>
                </div>
              )}
            </div>

            {/* Page preview, click to place */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">{sigPng ? "Click on the page to place your signature" : "Make a signature above first"}</p>
                {numPages > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <button onClick={() => { setPageIdx((p) => Math.max(0, p - 1)); setPlacement(null); }} disabled={pageIdx === 0} className="px-2 disabled:opacity-30">‹</button>
                    Page {pageIdx + 1}/{numPages}
                    <button onClick={() => { setPageIdx((p) => Math.min(numPages - 1, p + 1)); setPlacement(null); }} disabled={pageIdx === numPages - 1} className="px-2 disabled:opacity-30">›</button>
                  </div>
                )}
              </div>
              <div className="relative inline-block w-full">
                {pagePng && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pagePng} alt={`Page ${pageIdx + 1}`} onClick={placeAt} className="w-full rounded-lg cursor-crosshair" style={{ border: "1px solid var(--apple-border)" }} />
                )}
                {placement && placement.page === pageIdx && sigPng && pageDims.w > 0 && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sigPng} alt="placed" style={{ position: "absolute", left: `${placement.nx * 100}%`, top: `${placement.ny * 100}%`, width: `${(sigSize / pageDims.w) * 100}%`, transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {!resultUrl ? (
                <button onClick={apply} disabled={!placement} className="btn-primary disabled:opacity-50">Sign PDF</button>
              ) : (
                <a href={resultUrl} download={fileName.replace(/\.pdf$/i, "") + "-signed.pdf"} className="btn-primary">Download signed PDF</a>
              )}
              <button onClick={() => { setBytes(null); setSigPng(""); setPlacement(null); setResultUrl(null); }} className="btn-secondary">Start over</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
