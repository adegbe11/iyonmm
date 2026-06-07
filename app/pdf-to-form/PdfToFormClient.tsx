"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

type FieldType = "text" | "checkbox" | "radio" | "dropdown" | "optionlist";
interface FormField {
  name: string;
  type: FieldType;
  options?: string[];
  value: string | boolean;
}

export default function PdfToFormClient() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [bytes, setBytes] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError("");
    setResultUrl(null);
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList } = await import("pdf-lib");
      const doc = await PDFDocument.load(buf);
      const form = doc.getForm();
      const raw = form.getFields();
      if (!raw.length) {
        setError("This PDF has no fillable form fields. Try a PDF that was built as a form.");
        setLoading(false);
        return;
      }
      const parsed: FormField[] = raw.map((f) => {
        const name = f.getName();
        if (f instanceof PDFTextField) return { name, type: "text" as const, value: f.getText() || "" };
        if (f instanceof PDFCheckBox) return { name, type: "checkbox" as const, value: f.isChecked() };
        if (f instanceof PDFRadioGroup) return { name, type: "radio" as const, options: f.getOptions(), value: f.getSelected() || "" };
        if (f instanceof PDFDropdown) return { name, type: "dropdown" as const, options: f.getOptions(), value: (f.getSelected() || [])[0] || "" };
        if (f instanceof PDFOptionList) return { name, type: "optionlist" as const, options: f.getOptions(), value: (f.getSelected() || [])[0] || "" };
        return { name, type: "text" as const, value: "" };
      });
      setFields(parsed);
      setBytes(buf);
      setFileName(file.name);
    } catch (e) {
      console.error(e);
      setError("Could not read that PDF. Make sure it is a valid, unlocked PDF form.");
    }
    setLoading(false);
  }

  function update(name: string, value: string | boolean) {
    setFields((prev) => prev.map((f) => (f.name === name ? { ...f, value } : f)));
    setResultUrl(null);
  }

  async function fillAndDownload() {
    if (!bytes) return;
    setLoading(true);
    try {
      const { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFOptionList } = await import("pdf-lib");
      const doc = await PDFDocument.load(bytes);
      const form = doc.getForm();
      for (const f of fields) {
        try {
          const field = form.getField(f.name);
          if (field instanceof PDFTextField) field.setText(String(f.value || ""));
          else if (field instanceof PDFCheckBox) { f.value ? field.check() : field.uncheck(); }
          else if (field instanceof PDFRadioGroup && f.value) field.select(String(f.value));
          else if (field instanceof PDFDropdown && f.value) field.select(String(f.value));
          else if (field instanceof PDFOptionList && f.value) field.select(String(f.value));
        } catch { /* skip a field that cannot take the value */ }
      }
      const out = await doc.save();
      const blob = new Blob([out.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      setError("Could not fill the PDF.");
    }
    setLoading(false);
  }

  function reset() {
    setFields([]); setBytes(null); setResultUrl(null); setError(""); setFileName("");
  }

  function pretty(name: string) {
    return name.replace(/[_\-.]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <ToolShell
      title="Fill PDF Forms Online"
      subtitle="Turn a PDF form into a clean, mobile-friendly web form, fill it out, and download the completed PDF. Nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload a PDF form", desc: "We read its fillable fields right in your browser." },
        { icon: "✏️", title: "Fill the web form", desc: "A clean, easy form, much nicer than tiny PDF boxes." },
        { icon: "💾", title: "Download", desc: "Get the original PDF with your answers filled in." },
      ]}
      faqs={[
        { q: "Are my files uploaded?", a: "No. Everything runs in your browser. Your PDF never leaves your device." },
        { q: "My PDF has no fields. Why?", a: "This tool needs a PDF with real form fields (an AcroForm). Flat scans with no fields are not supported yet." },
        { q: "Will the layout be preserved?", a: "Yes. We write your answers back into the original PDF, so its layout is untouched." },
        { q: "What field types are supported?", a: "Text boxes, checkboxes, radio buttons, dropdowns, and list boxes." },
      ]}
      related={[
        { label: "Protect PDF", href: "/protect-pdf" },
        { label: "Watermark PDF", href: "/watermark-pdf" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ]}
    >
      <div>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}

        {fields.length === 0 && !loading && (
          <DropZone accept="application/pdf,.pdf" onFiles={handleFile} label="Select PDF form or drop it here" sublabel="Must be a PDF with fillable fields" />
        )}

        {loading && (
          <div className="py-16 text-center"><div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" /><p className="text-sm font-medium">Working...</p></div>
        )}

        {fields.length > 0 && !loading && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm">{fileName} · {fields.length} field{fields.length !== 1 ? "s" : ""}</p>
              <button onClick={reset} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Start over</button>
            </div>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1">{pretty(f.name)}</label>
                  {f.type === "text" && (
                    <input value={String(f.value)} onChange={(e) => update(f.name, e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} />
                  )}
                  {f.type === "checkbox" && (
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={Boolean(f.value)} onChange={(e) => update(f.name, e.target.checked)} className="w-5 h-5 accent-[#673DE6]" />
                      <span className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Yes</span>
                    </label>
                  )}
                  {(f.type === "dropdown" || f.type === "optionlist") && (
                    <select value={String(f.value)} onChange={(e) => update(f.name, e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#673DE6] bg-white" style={{ borderColor: "var(--apple-border)" }}>
                      <option value="">Select...</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                  {f.type === "radio" && (
                    <div className="flex flex-wrap gap-2">
                      {f.options?.map((o) => (
                        <button key={o} onClick={() => update(f.name, o)} className={`px-4 py-2 rounded-full text-sm border ${f.value === o ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>{o}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              {!resultUrl ? (
                <button onClick={fillAndDownload} className="btn-primary">Fill PDF</button>
              ) : (
                <>
                  <a href={resultUrl} download={fileName.replace(/\.pdf$/i, "") + "-filled.pdf"} className="btn-primary">Download filled PDF</a>
                  <button onClick={fillAndDownload} className="btn-secondary">Re-fill</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
