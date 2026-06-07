"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "What does it do?", a: "It validates, pretty-prints, and minifies JSON. Errors are shown with a clear message so you can fix them fast." },
  { q: "Is my JSON sent anywhere?", a: "No. All parsing happens in your browser. Nothing is uploaded." },
  { q: "Can it handle large files?", a: "Yes, as large as your browser memory allows." },
];

export default function Client() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  function format(min = false) {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, min ? 0 : indent));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }

  return (
    <WidgetShell title="JSON Formatter" subtitle="Validate, pretty-print, and minify JSON instantly. Free, private, runs in your browser." badge="Instant" faqs={faqs}
      related={[{ label: ".env Validator", href: "/env-validator" }, { label: "Regex Tester", href: "/regex-tester" }, { label: "Word Counter", href: "/word-counter" }]}>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <button onClick={() => format(false)} className="btn-primary text-sm px-4 py-2">Beautify</button>
        <button onClick={() => format(true)} className="btn-secondary text-sm px-4 py-2">Minify</button>
        <label className="text-sm flex items-center gap-2">Indent
          <select value={indent} onChange={(e) => setIndent(+e.target.value)} className="border rounded-lg px-2 py-1 bg-white" style={{ borderColor: "var(--apple-border)" }}>
            <option value={2}>2</option><option value={4}>4</option><option value={8}>8</option>
          </select>
        </label>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-secondary text-sm px-4 py-2 ml-auto">Copy</button>}
      </div>
      {error && <div className="mb-3 p-3 rounded-xl text-sm font-mono" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}
      <div className="grid md:grid-cols-2 gap-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} placeholder='{"paste":"your JSON here"}' className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y" style={{ borderColor: "var(--apple-border)" }} />
        <textarea value={output} readOnly rows={16} placeholder="Formatted output appears here" className="w-full border rounded-2xl p-4 text-sm font-mono outline-none resize-y" style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)" }} />
      </div>
    </WidgetShell>
  );
}
