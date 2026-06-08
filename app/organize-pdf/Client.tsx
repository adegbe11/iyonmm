"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface Pg { src: number; url: string; rot: number }

export default function Client() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<Pg[]>([]);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function load(files: File[]) {
    const f = files[0]; if (!f) return;
    setBusy(true); setResultUrl(null); setFileName(f.name);
    try {
      const buf = await f.arrayBuffer(); setBytes(buf);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      const out: Pg[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.35 });
        const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: c.getContext("2d") as any, viewport: vp, canvas: c } as any).promise;
        out.push({ src: i - 1, url: c.toDataURL("image/jpeg", 0.7), rot: 0 });
      }
      setPages(out);
    } catch (e) { console.error(e); alert("Could not read that PDF."); }
    setBusy(false);
  }

  function move(i: number, d: number) {
    setPages((p) => { const a = [...p]; const j = i + d; if (j < 0 || j >= a.length) return p; [a[i], a[j]] = [a[j], a[i]]; return a; });
    setResultUrl(null);
  }
  function rotate(i: number) { setPages((p) => p.map((pg, k) => k === i ? { ...pg, rot: (pg.rot + 90) % 360 } : pg)); setResultUrl(null); }
  function del(i: number) { setPages((p) => p.filter((_, k) => k !== i)); setResultUrl(null); }

  async function apply() {
    if (!bytes || !pages.length) return;
    setBusy(true);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const src = await PDFDocument.load(bytes);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p.src));
      pages.forEach((p, i) => { const pg = copied[i]; const base = pg.getRotation().angle; pg.setRotation(degrees((base + p.rot) % 360)); out.addPage(pg); });
      const data = await out.save();
      setResultUrl(URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })));
    } catch (e) { console.error(e); alert("Could not save the PDF."); }
    setBusy(false);
  }

  return (
    <ToolShell title="Organize PDF" subtitle="Reorder, rotate, and delete pages, then save a clean PDF. Everything runs in your browser." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Upload PDF", desc: "We render page thumbnails." }, { icon: "🔀", title: "Arrange", desc: "Move, rotate, or remove pages." }, { icon: "💾", title: "Download", desc: "Save your reorganized PDF." }]}
      faqs={[{ q: "Are my files uploaded?", a: "No. Everything runs in your browser with pdf-lib and PDF.js." }, { q: "Can I rotate single pages?", a: "Yes, each page rotates independently in 90 degree steps." }, { q: "Can I delete pages?", a: "Yes, remove any page before saving." }, { q: "Is it free?", a: "Yes, free with no limits or signup." }]}
      related={[{ label: "Merge PDF", href: "/merge-pdf" }, { label: "Split PDF", href: "/split-pdf" }, { label: "Rotate PDF", href: "/rotate-pdf" }]}>
      <div>
        {pages.length === 0 && !busy && <DropZone accept="application/pdf,.pdf" onFiles={load} label="Select PDF file or drop PDF here" sublabel="Any size works" />}
        {busy && pages.length === 0 && <div className="py-16 text-center"><div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" /><p className="text-sm">Loading pages...</p></div>}
        {pages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
              <button onClick={() => { setPages([]); setBytes(null); setResultUrl(null); }} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Start over</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-5">
              {pages.map((p, i) => (
                <div key={i} className="card p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Page ${i + 1}`} className="w-full rounded mb-2" style={{ transform: `rotate(${p.rot}deg)` }} />
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--apple-text-secondary)" }}>{i + 1}</span>
                    <div className="flex gap-1">
                      <button onClick={() => move(i, -1)} className="px-1.5 py-0.5 rounded hover:bg-[#F5F5F7]">←</button>
                      <button onClick={() => rotate(i)} className="px-1.5 py-0.5 rounded hover:bg-[#F5F5F7]">⟳</button>
                      <button onClick={() => move(i, 1)} className="px-1.5 py-0.5 rounded hover:bg-[#F5F5F7]">→</button>
                      <button onClick={() => del(i)} className="px-1.5 py-0.5 rounded hover:bg-[#FFF0F0]" style={{ color: "#FF3B30" }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!resultUrl ? (
              <button onClick={apply} disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Saving..." : "Apply & Save"}</button>
            ) : (
              <div className="flex gap-3"><a href={resultUrl} download={fileName.replace(/\.pdf$/i, "") + "-organized.pdf"} className="btn-primary">Download PDF</a><button onClick={() => setResultUrl(null)} className="btn-secondary">Edit more</button></div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
