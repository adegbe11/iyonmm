"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

const ALGOS = ["SHA-256", "SHA-1", "SHA-384", "SHA-512"] as const;

export default function Client() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  async function run() {
    const enc = new TextEncoder().encode(text);
    const out: Record<string, string> = {};
    for (const a of ALGOS) {
      const buf = await crypto.subtle.digest(a, enc);
      out[a] = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    setHashes(out);
  }

  const faqs = [
    { q: "Which algorithms are supported?", a: "SHA-256, SHA-1, SHA-384, and SHA-512, computed with the browser's built-in Web Crypto API." },
    { q: "Why no MD5?", a: "MD5 is insecure and not provided by the browser crypto API. Use SHA-256 or stronger." },
    { q: "Is my text uploaded?", a: "No. Hashing runs entirely in your browser. Nothing is sent anywhere." },
  ];

  return (
    <WidgetShell title="Hash Generator" subtitle="Generate SHA-256, SHA-1, SHA-384, and SHA-512 hashes of any text, instantly and privately in your browser." badge="100% Client-side" faqs={faqs}
      related={[{ label: "Base64", href: "/base64" }, { label: "UUID Generator", href: "/uuid-generator" }, { label: "JWT Decoder", href: "/jwt-decoder" }]}>
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Text to hash" className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y mb-3" style={{ borderColor: "var(--apple-border)" }} />
        <button onClick={run} className="btn-primary text-sm px-5 py-2 mb-4">Generate hashes</button>
        {Object.keys(hashes).length > 0 && (
          <div className="space-y-2">
            {ALGOS.map((a) => (
              <div key={a} className="card p-3">
                <div className="flex items-center justify-between mb-1"><span className="text-xs font-semibold" style={{ color: "var(--apple-blue)" }}>{a}</span><button onClick={() => navigator.clipboard.writeText(hashes[a])} className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>Copy</button></div>
                <p className="text-xs font-mono break-all">{hashes[a]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
