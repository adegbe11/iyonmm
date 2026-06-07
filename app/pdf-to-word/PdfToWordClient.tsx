"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function PdfToWordClient() {
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    setProcessing(true);
    setResultUrl(null);
    setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const { Document, Packer, Paragraph, TextRun } = await import("docx");

      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const paragraphs: InstanceType<typeof Paragraph>[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // Group text items into lines by their y-position
        let lastY: number | null = null;
        let line = "";
        for (const item of content.items) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const it = item as any;
          if (!("str" in it)) continue;
          const y = it.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 2) {
            paragraphs.push(new Paragraph({ children: [new TextRun(line.trim())] }));
            line = "";
          }
          line += it.str + (it.hasEOL ? "" : " ");
          lastY = y;
        }
        if (line.trim()) paragraphs.push(new Paragraph({ children: [new TextRun(line.trim())] }));
        if (i < pdf.numPages) paragraphs.push(new Paragraph({ children: [], pageBreakBefore: true }));
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Conversion failed. Scanned PDFs (images) have no extractable text, use OCR PDF first.");
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="PDF to Word"
      subtitle="Convert a PDF into an editable Word (DOCX) document. Text is extracted and rebuilt locally, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select a text-based PDF." },
        { icon: "⚙️", title: "Extract & rebuild", desc: "Text is pulled out and written into a DOCX." },
        { icon: "💾", title: "Download DOCX", desc: "Open and edit in Word, Google Docs, or Pages." },
      ]}
      faqs={[
        { q: "Are my PDFs uploaded?", a: "No. Extraction uses PDF.js and the docx library, all in your browser." },
        { q: "Does it work on scanned PDFs?", a: "No. Scanned PDFs are images with no text layer. Run OCR PDF first to extract the text, then convert." },
        { q: "Is the original layout preserved?", a: "Text content and line breaks are preserved. Complex layouts, columns, and exact fonts are simplified since this is client-side." },
        { q: "What format is the output?", a: "A standard .docx file compatible with Microsoft Word, Google Docs, and Apple Pages." },
      ]}
      related={[
        { label: "Word to PDF", href: "/word-to-pdf" },
        { label: "OCR PDF", href: "/ocr-pdf" },
        { label: "PDF to Excel", href: "/pdf-to-excel" },
      ]}
    >
      <div className="space-y-4">
        {!processing && !resultUrl && (
          <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF file or drop PDF here" sublabel="Works with PDFs that have real text. Any size." />
        )}
        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Converting... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
        {resultUrl && (
          <div className="card p-5 text-center">
            <p className="font-semibold mb-3">✅ Converted to Word</p>
            <div className="flex gap-3 justify-center">
              <a href={resultUrl} download={fileName.replace(/\.[^.]+$/, "") + ".docx"} className="btn-primary">Download DOCX</a>
              <button onClick={() => setResultUrl(null)} className="btn-secondary">Convert another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
