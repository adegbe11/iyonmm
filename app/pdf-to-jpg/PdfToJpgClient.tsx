"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface PageResult { pageNum: number; url: string }

export default function PdfToJpgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<PageResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(2);

  async function convert(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setProcessing(true);
    setResults([]);
    setProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const total = pdf.numPages;
      const out: PageResult[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx as any, viewport, canvas } as any).promise;
        const url = canvas.toDataURL("image/jpeg", 0.92);
        out.push({ pageNum: i, url });
        setProgress(Math.round((i / total) * 100));
      }

      setResults(out);
    } catch (e) {
      alert("Failed to convert PDF. Make sure it is a valid, unencrypted PDF.");
      console.error(e);
    }
    setProcessing(false);
  }

  function downloadAll() {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = `${file?.name.replace(".pdf", "") || "page"}-${r.pageNum}.jpg`;
      a.click();
    });
  }

  return (
    <ToolShell
      title="PDF to JPG"
      subtitle="Convert every page of your PDF to high-quality JPG images. Runs in your browser, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the PDF to convert." },
        { icon: "⚙️", title: "Choose resolution", desc: "Higher scale = sharper images, bigger files." },
        { icon: "🖼️", title: "Download images", desc: "Save individual pages or all at once." },
      ]}
      faqs={[
        { q: "What resolution are the output images?", a: "Scale 2x gives roughly 150 DPI, suitable for screen and web. Scale 3x gives ~225 DPI, good for print." },
        { q: "Are my PDFs uploaded?", a: "No. Conversion uses PDF.js running in your browser." },
        { q: "Can I convert a single page?", a: "All pages are converted. You can download just the pages you need individually." },
        { q: "Is there a page limit?", a: "No. Convert PDFs of any length." },
      ]}
      related={[
        { label: "Image to PDF", href: "/image-to-pdf" },
        { label: "JPG to PDF", href: "/jpg-to-pdf" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "Compress Image", href: "/compress-image" },
      ]}
    >
      <div className="space-y-4">
        {!processing && results.length === 0 && (
          <>
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <label className="text-sm font-medium whitespace-nowrap">Resolution</label>
              <input type="range" min={1} max={4} step={0.5} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="flex-1 accent-[#673DE6]" />
              <span className="text-sm font-semibold w-12 text-right">{scale}x</span>
            </div>
            <DropZone accept="application/pdf,.pdf" onFiles={convert} label="Select PDF file or drop PDF here" sublabel="Any number of pages, any size" />
          </>
        )}

        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Converting pages... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">{results.length} page{results.length > 1 ? "s" : ""} converted</p>
              <div className="flex gap-2">
                <button onClick={() => { setResults([]); setFile(null); }} className="btn-secondary text-sm px-4 py-2">Convert another</button>
                <button onClick={downloadAll} className="btn-primary text-sm px-4 py-2">Download all</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((r) => (
                <div key={r.pageNum} className="card overflow-hidden">
                  <img src={r.url} alt={`Page ${r.pageNum}`} className="w-full" />
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "var(--apple-text-secondary)" }}>Page {r.pageNum}</span>
                    <a href={r.url} download={`${file?.name.replace(".pdf", "") || "page"}-${r.pageNum}.jpg`} className="text-xs font-semibold" style={{ color: "var(--apple-blue)" }}>Download</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
