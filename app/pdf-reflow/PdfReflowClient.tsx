"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import { reflowPage, stitch, type RawItem, type Block } from "@/lib/reflow";

export default function PdfReflowClient() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [fontScale, setFontScale] = useState(1);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    setProcessing(true);
    setBlocks(null);
    setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

      let all: Block[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        const items: RawItem[] = [];
        for (const it of content.items) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const t = it as any;
          if (!("str" in t) || !t.str) continue;
          const size = Math.hypot(t.transform[2], t.transform[3]) || t.height || 12;
          items.push({
            str: t.str,
            x: t.transform[4],
            top: viewport.height - t.transform[5],
            width: t.width,
            size,
            bold: /bold|black|heavy|semibold/i.test(t.fontName || ""),
          });
        }
        all = all.concat(reflowPage(items, viewport.width));
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const stitched = stitch(all);
      if (!stitched.length) {
        alert("No readable text found. If this is a scanned PDF, run OCR PDF first, then reflow.");
      } else {
        setBlocks(stitched);
      }
    } catch (e) {
      console.error(e);
      alert("Could not read that PDF. Make sure it is a valid, unlocked PDF with real text.");
    }
    setProcessing(false);
  }

  function downloadHtml() {
    if (!blocks) return;
    const body = blocks.map((b) =>
      b.type === "h1" ? `<h1>${esc(b.text)}</h1>` :
      b.type === "h2" ? `<h2>${esc(b.text)}</h2>` :
      `<p>${esc(b.text)}</p>`
    ).join("\n");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fileName)}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;max-width:720px;margin:0 auto;padding:24px;line-height:1.7;color:#1d1d1f}h1{font-size:1.6rem;margin:1.4em 0 .4em}h2{font-size:1.25rem;margin:1.2em 0 .3em}p{margin:0 0 1em;font-size:1.05rem}</style></head><body>${body}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName.replace(/\.[^.]+$/, "") + "-reflowed.html";
    a.click();
  }

  return (
    <ToolShell
      title="Make a PDF Readable on Mobile"
      subtitle="Reflow a fixed, multi-column PDF into a clean single column that fits your screen. No more pinch and zoom. Everything runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Add your PDF", desc: "Drop in an article, paper, or report with real text." },
        { icon: "🔀", title: "We reflow it", desc: "Columns are detected and merged into one readable column." },
        { icon: "📱", title: "Read or save", desc: "Read it right here, or download a clean HTML version." },
      ]}
      faqs={[
        { q: "What does reflowing do?", a: "It rebuilds a rigid, multi-column PDF into a single flowing column that resizes to your screen, so you can read on a phone without zooming." },
        { q: "Are my PDFs uploaded?", a: "No. The whole process runs in your browser with PDF.js. Your file never leaves your device." },
        { q: "Does it work on scanned PDFs?", a: "No. Scanned PDFs are images with no text layer. Run OCR PDF first, then reflow." },
        { q: "How accurate is the layout detection?", a: "Clean academic and corporate documents reflow very well. Heavily designed pages with sidebars and callouts may need a little manual cleanup." },
      ]}
      related={[
        { label: "OCR PDF", href: "/ocr-pdf" },
        { label: "PDF to Word", href: "/pdf-to-word" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "PDF to JPG", href: "/pdf-to-jpg" },
      ]}
    >
      <div>
        {!processing && !blocks && (
          <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF file or drop PDF here" sublabel="Works with PDFs that have real text. Any size." />
        )}

        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Reflowing... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        {blocks && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <p className="font-semibold text-sm">Reflowed reading view</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontScale((s) => Math.max(0.8, s - 0.1))} className="btn-secondary text-sm px-3 py-1.5">A-</button>
                <button onClick={() => setFontScale((s) => Math.min(1.6, s + 0.1))} className="btn-secondary text-sm px-3 py-1.5">A+</button>
                <button onClick={downloadHtml} className="btn-primary text-sm px-4 py-1.5">Download HTML</button>
                <button onClick={() => setBlocks(null)} className="btn-secondary text-sm px-3 py-1.5">New file</button>
              </div>
            </div>
            <div
              className="card p-6 md:p-8 max-h-[70vh] overflow-y-auto"
              style={{ lineHeight: 1.7, fontSize: `${fontScale}rem` }}
            >
              {blocks.map((b, i) =>
                b.type === "h1" ? <h1 key={i} className="font-bold mt-6 mb-2" style={{ fontSize: "1.5em" }}>{b.text}</h1> :
                b.type === "h2" ? <h2 key={i} className="font-semibold mt-5 mb-2" style={{ fontSize: "1.2em" }}>{b.text}</h2> :
                <p key={i} className="mb-4" style={{ color: "var(--apple-black)" }}>{b.text}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
