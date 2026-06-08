"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function Client() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handle(files: File[]) {
    const f = files[0]; if (!f) return;
    setFileName(f.name); setBusy(true); setText(""); setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      let out = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const c = await (await pdf.getPage(i)).getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let line = "", lastY: number | null = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const it of c.items as any[]) {
          if (!("str" in it)) continue;
          const y = it.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 2) { out += line.trimEnd() + "\n"; line = ""; }
          line += it.str + (it.hasEOL ? "" : " "); lastY = y;
        }
        out += line.trimEnd() + "\n\n";
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      if (!out.trim()) alert("No text found. If this is a scanned PDF, run OCR PDF first.");
      setText(out.trim());
    } catch (e) { console.error(e); alert("Could not read that PDF."); }
    setBusy(false);
  }

  function download() { const b = new Blob([text], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = fileName.replace(/\.[^.]+$/, "") + ".txt"; a.click(); }

  return (
    <ToolShell title="PDF to Text" subtitle="Pull all the text out of a PDF to copy or save as a .txt file. Runs in your browser, nothing uploaded." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Upload PDF", desc: "Select a text-based PDF." }, { icon: "📝", title: "Extract", desc: "We read the text layer." }, { icon: "📋", title: "Copy or save", desc: "Copy it or download .txt." }]}
      faqs={[{ q: "Are my PDFs uploaded?", a: "No. Extraction uses PDF.js in your browser." }, { q: "Does it work on scans?", a: "No. Scanned PDFs are images. Run OCR PDF first." }, { q: "Does it keep formatting?", a: "It keeps line breaks. Tables and columns are flattened to plain text." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "OCR PDF", href: "/ocr-pdf" }, { label: "PDF to Word", href: "/pdf-to-word" }, { label: "PDF to Markdown", href: "/pdf-to-markdown" }]}>
      <div>
        {!text && !busy && <DropZone accept="application/pdf,.pdf" onFiles={handle} label="Select PDF file or drop PDF here" sublabel="Works with PDFs that have real text" />}
        {busy && <div className="py-16 text-center"><p className="text-sm font-medium mb-4">Extracting... {progress}%</p><div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div></div>}
        {text && (
          <div>
            <div className="flex items-center justify-between mb-2"><p className="text-sm font-semibold">Extracted text</p><div className="flex gap-2"><button onClick={() => navigator.clipboard.writeText(text)} className="btn-secondary text-sm px-3 py-1.5">Copy</button><button onClick={download} className="btn-primary text-sm px-3 py-1.5">Download .txt</button><button onClick={() => setText("")} className="btn-secondary text-sm px-3 py-1.5">New file</button></div></div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={18} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y" style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)" }} />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
