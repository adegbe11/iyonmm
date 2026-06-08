"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function OcrPdfClient() {
  const [processing, setProcessing] = useState(false);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    setProcessing(true);
    setText("");
    setProgress(0);

    try {
      const Tesseract = await import("tesseract.js");
      const worker = await Tesseract.createWorker("eng", 1, {
        logger: (m: { progress: number }) => {
          if (m.progress) setProgress(Math.round(m.progress * 100));
        },
      });

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        // For PDFs: render page 1 via PDF.js, then OCR the canvas
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const buf = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let allText = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await page.render({ canvasContext: canvas.getContext("2d") as any, viewport: vp, canvas } as any).promise;
          const { data: { text: t } } = await worker.recognize(canvas);
          allText += `\n\n--- Page ${i} ---\n${t}`;
        }
        setText(allText.trim());
      } else {
        const { data: { text: t } } = await worker.recognize(file);
        setText(t);
      }

      await worker.terminate();
    } catch (e) {
      alert("OCR failed. Try a clearer image or PDF.");
      console.error(e);
    }
    setProcessing(false);
  }

  function downloadText() {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName.replace(/\.[^.]+$/, "") + "-ocr.txt";
    a.click();
  }

  return (
    <ToolShell
      title="OCR PDF"
      subtitle="Extract text from scanned PDFs and images using optical character recognition. Everything runs in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload file", desc: "Select a scanned PDF or image (JPEG, PNG)." },
        { icon: "🔍", title: "Auto-OCR", desc: "Tesseract.js reads the text from your document." },
        { icon: "📋", title: "Copy or download", desc: "Copy the extracted text or save as a .txt file." },
      ]}
      faqs={[
        { q: "What file types does OCR support?", a: "Scanned PDFs, JPEG, PNG, WebP, and TIFF images." },
        { q: "Are files uploaded?", a: "No. OCR runs entirely in your browser using Tesseract.js. Nothing is sent to any server." },
        { q: "How accurate is the OCR?", a: "Accuracy depends on scan quality. Clear, high-resolution scans typically achieve 95%+ accuracy." },
        { q: "Is there a page limit for PDFs?", a: "Currently, the first 10 pages are processed. Full document OCR is coming soon." },
      ]}
      related={[
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "PDF to JPG", href: "/pdf-to-jpg" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ]}
    >
      <div className="space-y-4">
        <DropZone accept="application/pdf,.pdf,image/jpeg,image/png,image/webp" onFiles={handleFile} label="Select a scanned PDF or image, or drop it here" sublabel="PDF, JPEG, PNG, WebP" />

        {processing && (
          <div className="py-8 text-center">
            <p className="text-sm font-medium mb-3">Running OCR... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto mb-2">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>This may take 30-60 seconds for the first run while the OCR engine loads.</p>
          </div>
        )}

        {text && !processing && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Extracted text</p>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(text)} className="btn-secondary text-sm px-3 py-1.5">Copy</button>
                <button onClick={downloadText} className="btn-primary text-sm px-3 py-1.5">Download .txt</button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y"
              style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)" }}
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
