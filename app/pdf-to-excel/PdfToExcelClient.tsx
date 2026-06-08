"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function PdfToExcelClient() {
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const XLSX = await import("xlsx");

      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      const rows: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // Cluster text items into rows by y, then columns by x
        const items = content.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((it: any) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }))
          .filter((it) => it.str.trim());

        const lineMap = new Map<number, { x: number; str: string }[]>();
        for (const it of items) {
          const key = Math.round(it.y / 4) * 4;
          if (!lineMap.has(key)) lineMap.set(key, []);
          lineMap.get(key)!.push({ x: it.x, str: it.str });
        }
        const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
        for (const y of sortedYs) {
          const cells = lineMap.get(y)!.sort((a, b) => a.x - b.x).map((c) => c.str);
          rows.push(cells);
        }
        if (i < pdf.numPages) rows.push([]);
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Conversion failed. Scanned PDFs have no extractable text, use OCR PDF first.");
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="PDF to Excel"
      subtitle="Pull text and tabular data from a PDF into an Excel spreadsheet, all in your browser. Nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select a PDF containing tables or data." },
        { icon: "⚙️", title: "Extract rows", desc: "Text is clustered into rows and columns by position." },
        { icon: "💾", title: "Download XLSX", desc: "Open in Excel, Google Sheets, or Numbers." },
      ]}
      faqs={[
        { q: "Are my PDFs uploaded?", a: "No. Extraction uses PDF.js and SheetJS entirely in your browser." },
        { q: "How accurate is table detection?", a: "Rows and columns are inferred from text positions. Clean, grid-like tables convert best. Irregular layouts may need manual cleanup." },
        { q: "Does it work on scanned PDFs?", a: "No. Scanned PDFs are images. Run OCR PDF first to get a text layer." },
        { q: "What format is the output?", a: "A standard .xlsx file compatible with Excel, Google Sheets, and Apple Numbers." },
      ]}
      related={[
        { label: "Excel to PDF", href: "/excel-to-pdf" },
        { label: "PDF to Word", href: "/pdf-to-word" },
        { label: "OCR PDF", href: "/ocr-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!processing && !resultUrl && (
          <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF file or drop PDF here" sublabel="Works with PDFs that have real text. Any size." />
        )}
        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Extracting data... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
        {resultUrl && (
          <div className="card p-5 text-center">
            <p className="font-semibold mb-3">✅ Converted to Excel</p>
            <div className="flex gap-3 justify-center">
              <a href={resultUrl} download={fileName.replace(/\.[^.]+$/, "") + ".xlsx"} className="btn-primary">Download XLSX</a>
              <button onClick={() => setResultUrl(null)} className="btn-secondary">Convert another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
