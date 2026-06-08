"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

type Row = { type: "same" | "add" | "del"; text: string };
function diff(a: string[], b: string[]): Row[] {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const rows: Row[] = []; let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { rows.push({ type: "same", text: a[i] }); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { rows.push({ type: "del", text: a[i] }); i++; } else { rows.push({ type: "add", text: b[j] }); j++; } }
  while (i < n) rows.push({ type: "del", text: a[i++] });
  while (j < m) rows.push({ type: "add", text: b[j++] });
  return rows;
}

export default function Client() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);

  function run() { setRows(diff(a.split("\n"), b.split("\n"))); }

  const faqs = [
    { q: "Is my text uploaded?", a: "No. The comparison runs entirely in your browser. Nothing is sent anywhere." },
    { q: "How does it compare?", a: "Line by line, using a longest-common-subsequence diff. Added lines are green, removed lines red." },
    { q: "Is it free?", a: "Yes, free with no signup." },
  ];

  return (
    <WidgetShell title="Text Diff Checker" subtitle="Compare two blocks of text and highlight what changed, line by line. Free and private." badge="100% Client-side" faqs={faqs}
      related={[{ label: "JSON Formatter", href: "/json-formatter" }, { label: "Word Counter", href: "/word-counter" }, { label: "Compare PDF", href: "/compare-pdf" }]}>
      <div>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <textarea value={a} onChange={(e) => setA(e.target.value)} rows={10} placeholder="Original text" className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y" style={{ borderColor: "var(--apple-border)" }} />
          <textarea value={b} onChange={(e) => setB(e.target.value)} rows={10} placeholder="Changed text" className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y" style={{ borderColor: "var(--apple-border)" }} />
        </div>
        <button onClick={run} className="btn-primary text-sm px-5 py-2 mb-4">Compare</button>
        {rows && (
          <div className="card p-4 font-mono text-sm max-h-[55vh] overflow-y-auto">
            {rows.map((r, i) => (
              <div key={i} className="px-2 py-0.5 rounded" style={r.type === "add" ? { background: "#EBF9EE", color: "#1a7a33" } : r.type === "del" ? { background: "#FFF0F0", color: "#c0271c" } : { color: "var(--apple-text-secondary)" }}>
                <span className="select-none mr-2">{r.type === "add" ? "+" : r.type === "del" ? "-" : " "}</span>{r.text || " "}
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
