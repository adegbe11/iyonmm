"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function Client() {
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [m, setM] = useState({ top: 5, right: 5, bottom: 5, left: 5 }); // percent
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load(files: File[]) {
    const f = files[0]; if (!f) return;
    setFileName(f.name); setResultUrl(null);
    try {
      const buf = await f.arrayBuffer(); setBytes(buf);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      const page = await pdf.getPage(1);
      const vp = page.getViewport({ scale: 1 });
      const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: c.getContext("2d") as any, viewport: vp, canvas: c } as any).promise;
      setPreview(c.toDataURL("image/jpeg", 0.8));
    } catch (e) { console.error(e); alert("Could not read that PDF."); }
  }

  async function apply() {
    if (!bytes) return; setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(bytes);
      doc.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const l = (m.left / 100) * width, r = (m.right / 100) * width, t = (m.top / 100) * height, b = (m.bottom / 100) * height;
        page.setCropBox(l, b, Math.max(1, width - l - r), Math.max(1, height - t - b));
      });
      const data = await doc.save();
      setResultUrl(URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })));
    } catch (e) { console.error(e); alert("Could not crop the PDF."); }
    setBusy(false);
  }

  const Field = ({ k }: { k: keyof typeof m }) => (
    <label className="text-sm">{k[0].toUpperCase() + k.slice(1)}: {m[k]}%
      <input type="range" min={0} max={45} value={m[k]} onChange={(e) => { setM({ ...m, [k]: +e.target.value }); setResultUrl(null); }} className="w-full accent-[#673DE6]" />
    </label>
  );

  return (
    <ToolShell title="Crop PDF" subtitle="Trim margins or edges from every page of a PDF. Runs in your browser, nothing uploaded." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Upload PDF", desc: "Preview page one." }, { icon: "✂️", title: "Set margins", desc: "Trim top, bottom, left, right." }, { icon: "💾", title: "Download", desc: "Save the cropped PDF." }]}
      faqs={[{ q: "Are my files uploaded?", a: "No. Cropping runs in your browser with pdf-lib." }, { q: "Does it crop all pages?", a: "Yes, the same crop is applied to every page." }, { q: "Is the cut content deleted?", a: "Cropping hides content outside the crop box; the file size is similar. For permanent removal use Redact." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "Redact PDF", href: "/redact-pdf" }, { label: "Organize PDF", href: "/organize-pdf" }, { label: "Rotate PDF", href: "/rotate-pdf" }]}>
      <div>
        {!bytes ? <DropZone accept="application/pdf,.pdf" onFiles={load} label="Select PDF file or drop PDF here" sublabel="Any size works" /> : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {preview && <img src={preview} alt="Preview" className="w-full rounded-xl" style={{ border: "1px solid var(--apple-border)" }} />}
              <div className="absolute pointer-events-none" style={{ top: `${m.top}%`, left: `${m.left}%`, right: `${m.right}%`, bottom: `${m.bottom}%`, border: "2px solid #673DE6", background: "rgba(103,61,230,0.08)" }} />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}><Field k="top" /><Field k="bottom" /><Field k="left" /><Field k="right" /></div>
              {!resultUrl ? <button onClick={apply} disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Cropping..." : "Crop PDF"}</button> :
                <div className="flex gap-3"><a href={resultUrl} download={fileName.replace(/\.pdf$/i, "") + "-cropped.pdf"} className="btn-primary">Download PDF</a><button onClick={() => { setBytes(null); setPreview(""); setResultUrl(null); }} className="btn-secondary">New file</button></div>}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
