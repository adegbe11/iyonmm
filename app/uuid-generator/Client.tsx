"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export default function Client() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  function gen() {
    const out: string[] = [];
    for (let i = 0; i < Math.min(1000, Math.max(1, count)); i++) out.push(crypto.randomUUID());
    setList(out);
  }

  const faqs = [
    { q: "What version of UUID is this?", a: "UUID v4 (random), generated with the browser's cryptographically secure crypto.randomUUID()." },
    { q: "Are they unique?", a: "Yes. v4 UUIDs are random with negligible collision probability, suitable for IDs and keys." },
    { q: "Is anything sent to a server?", a: "No. UUIDs are generated on your device. Nothing is uploaded." },
  ];

  return (
    <WidgetShell title="UUID Generator" subtitle="Generate cryptographically secure UUID v4 identifiers in bulk, right in your browser." badge="100% Client-side" faqs={faqs}
      related={[{ label: "Hash Generator", href: "/hash-generator" }, { label: "Base64", href: "/base64" }, { label: "JSON Formatter", href: "/json-formatter" }]}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm">How many<input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(+e.target.value)} className="ml-2 w-24 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} /></label>
          <button onClick={gen} className="btn-primary text-sm px-5 py-2">Generate</button>
          {list.length > 0 && <button onClick={() => navigator.clipboard.writeText(list.join("\n"))} className="btn-secondary text-sm px-5 py-2">Copy all</button>}
        </div>
        {list.length > 0 && (
          <div className="card p-4 font-mono text-sm max-h-[55vh] overflow-y-auto space-y-1">
            {list.map((u, i) => <div key={i} className="flex items-center justify-between gap-2 py-0.5"><span className="break-all">{u}</span><button onClick={() => navigator.clipboard.writeText(u)} className="text-xs flex-shrink-0" style={{ color: "var(--apple-text-secondary)" }}>copy</button></div>)}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
