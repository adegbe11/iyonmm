"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function WordToPdfClient() {
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setFileName(file.name);
    setProcessing(true);
    setResultUrl(null);
    try {
      const mammoth = await import("mammoth");
      const { default: jsPDF } = await import("jspdf");
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      const container = document.createElement("div");
      container.innerHTML = html;
      container.style.cssText = "width:760px;padding:48px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#000;background:#fff;position:fixed;left:-9999px;top:0;";
      document.body.appendChild(container);

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      await pdf.html(container, {
        margin: [40, 40, 40, 40],
        autoPaging: "text",
        width: 515,
        windowWidth: 760,
      });
      document.body.removeChild(container);

      const blob = pdf.output("blob");
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Conversion failed. Make sure the file is a valid .docx document. Older .doc files are not supported, re-save as .docx.");
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Word to PDF"
      subtitle="Convert DOCX documents to PDF right in your browser. Nothing is uploaded, your document stays on your device."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload DOCX", desc: "Select a Word document (.docx)." },
        { icon: "⚙️", title: "Convert", desc: "We render the document to PDF locally." },
        { icon: "💾", title: "Download", desc: "Save your PDF instantly." },
      ]}
      faqs={[
        { q: "Are my documents uploaded?", a: "No. Conversion runs entirely in your browser using mammoth.js and jsPDF. Nothing is sent to a server." },
        { q: "Does it support old .doc files?", a: "Only the modern .docx format is supported. Open a .doc in Word and Save As .docx first." },
        { q: "Will formatting be exactly preserved?", a: "Core formatting (headings, bold, lists, tables, images) is preserved best-effort. Complex layouts may shift slightly since rendering is client-side." },
        { q: "Is there a file size limit?", a: "No imposed limit. Very large documents may take longer to render." },
      ]}
      related={[
        { label: "PDF to Word", href: "/pdf-to-word" },
        { label: "Excel to PDF", href: "/excel-to-pdf" },
        { label: "Merge PDF", href: "/merge-pdf" },
        { label: "Compress PDF", href: "/compress-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!processing && !resultUrl && (
          <DropZone accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onFiles={handleFile} label="Select Word file or drop it here" sublabel="DOCX files. Any size works." />
        )}
        {processing && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Converting to PDF...</p>
          </div>
        )}
        {resultUrl && (
          <div className="card p-5 text-center">
            <p className="font-semibold mb-3">✅ Converted to PDF</p>
            <div className="flex gap-3 justify-center">
              <a href={resultUrl} download={fileName.replace(/\.[^.]+$/, "") + ".pdf"} className="btn-primary">Download PDF</a>
              <button onClick={() => setResultUrl(null)} className="btn-secondary">Convert another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
