"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import { reflowPage, stitch, type RawItem } from "@/lib/reflow";

export default function Client() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [md, setMd] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0]; if (!file) return;
    setFileName(file.name); setProcessing(true); setMd(""); setProgress(0);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      let blocks: ReturnType<typeof reflowPage> = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        const items: RawItem[] = [];
        for (const it of content.items) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const t = it as any;
          if (!("str" in t) || !t.str) continue;
          items.push({ str: t.str, x: t.transform[4], top: vp.height - t.transform[5], width: t.width, size: Math.hypot(t.transform[2], t.transform[3]) || 12, bold: /bold|black|heavy|semibold/i.test(t.fontName || "") });
        }
        blocks = blocks.concat(reflowPage(items, vp.width));
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      const clean = stitch(blocks);
      if (!clean.length) { alert("No readable text found. If this is a scanned PDF, run OCR PDF first."); setProcessing(false); return; }
      // De-hyphenate words broken across lines, then build markdown.
      const out = clean.map((b) => {
        const text = b.text.replace(/(\w)-\s+(\w)/g, "$1$2").replace(/\s+/g, " ").trim();
        if (b.type === "h1") return `# ${text}`;
        if (b.type === "h2") return `## ${text}`;
        return text;
      }).join("\n\n");
      setMd(out);
    } catch (e) { console.error(e); alert("Could not read that PDF."); }
    setProcessing(false);
  }

  function download() {
    const blob = new Blob([md], { type: "text/markdown" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = fileName.replace(/\.[^.]+$/, "") + ".md"; a.click();
  }

  return (
    <ToolShell
      title="PDF to Markdown"
      subtitle="Convert a PDF into clean Markdown, ready to paste into Notion or Obsidian. Strips page clutter and fixes broken line breaks. Nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select a text-based PDF." },
        { icon: "✨", title: "We clean it up", desc: "Headings become Markdown headings; broken lines and hyphens are fixed." },
        { icon: "📋", title: "Copy or download", desc: "Copy the Markdown or save a .md file." },
      ]}
      faqs={[
        { q: "Why Markdown?", a: "It pastes cleanly into Notion, Obsidian, and other note apps without the messy formatting of copied PDF text." },
        { q: "Are my PDFs uploaded?", a: "No. Conversion runs in your browser. Nothing leaves your device." },
        { q: "Does it work on scanned PDFs?", a: "No. Run OCR PDF first to get a text layer, then convert." },
        { q: "How are headings detected?", a: "By relative font size and weight. Larger or bold lines become Markdown headings." },
      ]}
      related={[{ label: "PDF to Word", href: "/pdf-to-word" }, { label: "OCR PDF", href: "/ocr-pdf" }, { label: "Read PDF on Mobile", href: "/pdf-reflow" }]}
    >
      <div>
        {!processing && !md && <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF file or drop PDF here" sublabel="Works with PDFs that have real text" />}
        {processing && (
          <div className="py-16 text-center"><p className="text-sm font-medium mb-4">Converting... {progress}%</p><div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div></div>
        )}
        {md && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Markdown output</p>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(md)} className="btn-secondary text-sm px-3 py-1.5">Copy</button>
                <button onClick={download} className="btn-primary text-sm px-3 py-1.5">Download .md</button>
                <button onClick={() => setMd("")} className="btn-secondary text-sm px-3 py-1.5">New file</button>
              </div>
            </div>
            <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={18} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y" style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)" }} />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
