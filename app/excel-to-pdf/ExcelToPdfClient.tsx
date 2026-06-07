"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function ExcelToPdfClient() {
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
      const XLSX = await import("xlsx");
      const { default: jsPDF } = await import("jspdf");
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);

      const container = document.createElement("div");
      let html = "";
      wb.SheetNames.forEach((name) => {
        const sheetHtml = XLSX.utils.sheet_to_html(wb.Sheets[name]);
        html += `<h2 style="font-family:Helvetica;font-size:14px;margin:16px 0 8px;">${name}</h2>${sheetHtml}`;
      });
      container.innerHTML = html;
      container.style.cssText = "width:760px;padding:32px;font-family:Helvetica,Arial,sans-serif;font-size:10px;color:#000;background:#fff;position:fixed;left:-9999px;top:0;";
      container.querySelectorAll("table").forEach((t) => {
        (t as HTMLElement).style.cssText = "border-collapse:collapse;width:100%;margin-bottom:16px;";
      });
      container.querySelectorAll("td,th").forEach((c) => {
        (c as HTMLElement).style.cssText = "border:1px solid #ccc;padding:4px 6px;";
      });
      document.body.appendChild(container);

      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
      await pdf.html(container, { margin: [30, 30, 30, 30], autoPaging: "text", width: 780, windowWidth: 760 });
      document.body.removeChild(container);

      const blob = pdf.output("blob");
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Conversion failed. Make sure the file is a valid Excel or CSV file.");
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Excel to PDF"
      subtitle="Convert XLSX, XLS, and CSV spreadsheets to PDF in your browser. Every sheet becomes a clean table. Nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📊", title: "Upload spreadsheet", desc: "Select an Excel or CSV file." },
        { icon: "⚙️", title: "Convert", desc: "Each sheet is rendered as a table in the PDF." },
        { icon: "💾", title: "Download", desc: "Save your PDF instantly." },
      ]}
      faqs={[
        { q: "Are my spreadsheets uploaded?", a: "No. Conversion runs entirely in your browser using SheetJS and jsPDF." },
        { q: "What formats are supported?", a: "XLSX, XLS, CSV, and other formats SheetJS can read." },
        { q: "Are charts and formulas preserved?", a: "Cell values are preserved. Charts and live formulas are not rendered, only the computed values appear." },
        { q: "How are multiple sheets handled?", a: "Each sheet is added to the PDF in order with its name as a heading." },
      ]}
      related={[
        { label: "PDF to Excel", href: "/pdf-to-excel" },
        { label: "Word to PDF", href: "/word-to-pdf" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!processing && !resultUrl && (
          <DropZone accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" onFiles={handleFile} label="Select Excel file or drop it here" sublabel="XLSX, XLS, CSV. Any size works." />
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
