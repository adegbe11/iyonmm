"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

type Row = { type: "same" | "add" | "del"; text: string };

async function extract(file: File): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const c = await (await pdf.getPage(i)).getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    text += c.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return text.split(/\n|(?<=\.)\s+/).map((l) => l.trim()).filter(Boolean);
}

// LCS-based line diff
function diff(a: string[], b: string[]): Row[] {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const rows: Row[] = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { rows.push({ type: "same", text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { rows.push({ type: "del", text: a[i] }); i++; }
    else { rows.push({ type: "add", text: b[j] }); j++; }
  }
  while (i < n) rows.push({ type: "del", text: a[i++] });
  while (j < m) rows.push({ type: "add", text: b[j++] });
  return rows;
}

export default function Client() {
  const [a, setA] = useState<File | null>(null);
  const [b, setB] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!a || !b) return; setBusy(true);
    try { setRows(diff(await extract(a), await extract(b))); }
    catch (e) { console.error(e); alert("Could not read one of the PDFs. Both must have real text."); }
    setBusy(false);
  }

  const adds = rows?.filter((r) => r.type === "add").length || 0;
  const dels = rows?.filter((r) => r.type === "del").length || 0;

  return (
    <ToolShell title="Compare PDF" subtitle="Compare two PDFs and see exactly what text was added or removed. Runs in your browser, nothing uploaded." badge="100% Client-side"
      steps={[{ icon: "📄", title: "Add two PDFs", desc: "The original and the new version." }, { icon: "🔍", title: "Compare", desc: "We diff the text line by line." }, { icon: "✅", title: "Review", desc: "Added lines in green, removed in red." }]}
      faqs={[{ q: "Are my files uploaded?", a: "No. Both PDFs are read and compared in your browser." }, { q: "What does it compare?", a: "The text content, line by line. Layout and images are not compared." }, { q: "Does it work on scans?", a: "Only on PDFs with real text. Run OCR PDF first on scans." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "PDF to Text", href: "/pdf-to-text" }, { label: "OCR PDF", href: "/ocr-pdf" }, { label: "Merge PDF", href: "/merge-pdf" }]}>
      <div>
        {!rows ? (
          <div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div><p className="text-xs font-semibold mb-2" style={{ color: "var(--apple-text-secondary)" }}>Original</p>{a ? <div className="card p-3 text-sm flex items-center justify-between"><span className="truncate">{a.name}</span><button onClick={() => setA(null)} style={{ color: "var(--apple-text-secondary)" }}>✕</button></div> : <DropZone accept="application/pdf,.pdf" onFiles={(f) => setA(f[0])} label="Select original PDF" sublabel="With real text" />}</div>
              <div><p className="text-xs font-semibold mb-2" style={{ color: "var(--apple-text-secondary)" }}>New version</p>{b ? <div className="card p-3 text-sm flex items-center justify-between"><span className="truncate">{b.name}</span><button onClick={() => setB(null)} style={{ color: "var(--apple-text-secondary)" }}>✕</button></div> : <DropZone accept="application/pdf,.pdf" onFiles={(f) => setB(f[0])} label="Select new PDF" sublabel="With real text" />}</div>
            </div>
            <button onClick={run} disabled={!a || !b || busy} className="btn-primary disabled:opacity-50">{busy ? "Comparing..." : "Compare PDFs"}</button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-3 text-sm">
              <span className="px-3 py-1 rounded-full font-semibold" style={{ background: "#EBF9EE", color: "#34C759" }}>+{adds} added</span>
              <span className="px-3 py-1 rounded-full font-semibold" style={{ background: "#FFF0F0", color: "#FF3B30" }}>-{dels} removed</span>
              <button onClick={() => { setRows(null); setA(null); setB(null); }} className="ml-auto btn-secondary text-sm px-4 py-1.5">New comparison</button>
            </div>
            <div className="card p-4 font-mono text-sm max-h-[60vh] overflow-y-auto">
              {rows.map((r, i) => (
                <div key={i} className="px-2 py-0.5 rounded" style={r.type === "add" ? { background: "#EBF9EE", color: "#1a7a33" } : r.type === "del" ? { background: "#FFF0F0", color: "#c0271c", textDecoration: "line-through" } : { color: "var(--apple-text-secondary)" }}>
                  <span className="select-none mr-2">{r.type === "add" ? "+" : r.type === "del" ? "−" : " "}</span>{r.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
