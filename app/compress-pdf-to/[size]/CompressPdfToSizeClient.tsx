"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import type { CompressTarget } from "@/lib/seo-data";
import { compressPdfTargets } from "@/lib/seo-data";

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// Rerender every PDF page to a JPEG at a given scale+quality, rebuild a PDF, measure bytes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildAtSettings(pdfDoc: any, PDFLib: any, scale: number, quality: number): Promise<Uint8Array> {
  const out = await PDFLib.PDFDocument.create();
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const vp = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width;
    canvas.height = vp.height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: ctx as any, viewport: vp, canvas } as any).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const img = await out.embedJpg(dataUrl);
    const p = out.addPage([canvas.width, canvas.height]);
    p.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height });
  }
  return out.save();
}

export default function CompressPdfToSizeClient({ target }: { target: CompressTarget }) {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<{ url: string; size: number; original: number; name: string; hit: boolean } | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setResult(null);
    setStatus("Reading PDF...");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const PDFLib = await import("pdf-lib");
      const pdfDoc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

      // Try descending (scale, quality) combos until we fit the target.
      const combos: [number, number][] = [
        [2, 0.8], [1.5, 0.7], [1.3, 0.6], [1.1, 0.5], [1, 0.45], [0.85, 0.4], [0.7, 0.35], [0.55, 0.3], [0.45, 0.25],
      ];
      let best: Uint8Array | null = null;
      for (let i = 0; i < combos.length; i++) {
        setStatus(`Compressing... (pass ${i + 1})`);
        const bytes = await buildAtSettings(pdfDoc, PDFLib, combos[i][0], combos[i][1]);
        if (!best || bytes.length < best.length) best = bytes;
        if (bytes.length <= target.bytes) { best = bytes; break; }
      }

      const blob = new Blob([best!.buffer as ArrayBuffer], { type: "application/pdf" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, original: file.size, name: file.name, hit: blob.size <= target.bytes });
    } catch (e) {
      console.error(e);
      alert("Could not compress that PDF. Make sure it is a valid, unlocked PDF.");
    }
    setProcessing(false);
    setStatus("");
  }

  const others = compressPdfTargets.filter((t) => t.slug !== target.slug).slice(0, 6);

  return (
    <ToolShell
      title={`Compress PDF to ${target.label}`}
      subtitle={`Shrink a PDF down to ${target.label} or under so it fits email attachments and upload limits. Nothing uploaded, all in your browser.`}
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Add your PDF", desc: "Drop in any PDF file." },
        { icon: "🎯", title: `We hit ${target.label}`, desc: `We rerender and compress the pages until the file fits ${target.label}.` },
        { icon: "💾", title: "Download", desc: "Save the smaller PDF ready to send." },
      ]}
      faqs={[
        { q: `How do I get a PDF under ${target.label}?`, a: `Drop your PDF and we automatically lower the resolution and quality until it is at or under ${target.label}.` },
        { q: "Are my PDFs uploaded?", a: "No. All compression runs in your browser. Your PDF never leaves your device." },
        { q: "Will the text stay selectable?", a: "To reliably hit a small exact size, pages are rerendered as images, so text becomes part of the image. For email and upload limits this is usually fine. If you need selectable text, use the standard Compress PDF tool instead." },
        { q: "What if it cannot reach the target?", a: "Very large or image-heavy PDFs may not reach tiny targets. We get as close as possible and show you the final size." },
      ]}
      related={[
        ...others.map((t) => ({ label: `Compress PDF to ${t.label}`, href: `/compress-pdf-to/${t.slug}` })),
        { label: "Compress PDF", href: "/compress-pdf" },
      ]}
    >
      <div>
        {!processing && !result && (
          <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF file or drop PDF here" sublabel="Any size works" />
        )}
        {processing && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">{status || `Compressing to ${target.label}...`}</p>
          </div>
        )}
        {result && (
          <div className="card p-6 text-center">
            <div className="text-4xl mb-3">{result.hit ? "✅" : "📄"}</div>
            <p className="font-bold text-lg mb-1">
              {result.hit ? `Compressed to ${fmtSize(result.size)}` : `Closest we could reach: ${fmtSize(result.size)}`}
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>
              {fmtSize(result.original)} down to {fmtSize(result.size)}
              {result.hit && <span className="ml-2 font-semibold" style={{ color: "#34C759" }}>under {target.label}</span>}
            </p>
            <div className="flex gap-3 justify-center">
              <a href={result.url} download={result.name.replace(/\.[^.]+$/, "") + `-${target.slug}.pdf`} className="btn-primary">Download PDF</a>
              <button onClick={() => setResult(null)} className="btn-secondary">Compress another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
