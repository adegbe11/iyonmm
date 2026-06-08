"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

function b64urlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return decodeURIComponent(escape(atob(s)));
}

export default function Client() {
  const [jwt, setJwt] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [err, setErr] = useState("");

  function decode(v: string) {
    setJwt(v); setErr(""); setHeader(""); setPayload("");
    if (!v.trim()) return;
    try {
      const parts = v.trim().split(".");
      if (parts.length < 2) throw new Error("bad");
      setHeader(JSON.stringify(JSON.parse(b64urlDecode(parts[0])), null, 2));
      setPayload(JSON.stringify(JSON.parse(b64urlDecode(parts[1])), null, 2));
    } catch { setErr("That does not look like a valid JWT."); }
  }

  const faqs = [
    { q: "Does it verify the signature?", a: "No. This tool decodes the header and payload so you can read them. It does not validate the signature, so never trust an unverified token in production." },
    { q: "Is my token uploaded?", a: "No. Decoding happens entirely in your browser. Your token never leaves your device, which matters for secrets." },
    { q: "Is it free?", a: "Yes, free with no signup." },
  ];

  const exp = (() => { try { const p = JSON.parse(payload); if (p.exp) return new Date(p.exp * 1000); } catch { } return null; })();

  return (
    <WidgetShell title="JWT Decoder" subtitle="Decode a JSON Web Token to read its header and payload, privately in your browser. Your token never leaves your device." badge="100% Client-side" faqs={faqs}
      related={[{ label: "Base64 Decode", href: "/base64" }, { label: "JSON Formatter", href: "/json-formatter" }, { label: "Hash Generator", href: "/hash-generator" }]}>
      <div>
        <textarea value={jwt} onChange={(e) => decode(e.target.value)} rows={4} placeholder="Paste your JWT (eyJ...)" className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y mb-3 break-all" style={{ borderColor: "var(--apple-border)" }} />
        {err && <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{err}</div>}
        {header && (
          <div className="grid md:grid-cols-2 gap-3">
            <div><p className="text-xs font-semibold mb-1" style={{ color: "var(--apple-text-secondary)" }}>HEADER</p><pre className="card p-3 text-xs font-mono overflow-x-auto" style={{ background: "var(--apple-gray)" }}>{header}</pre></div>
            <div><p className="text-xs font-semibold mb-1" style={{ color: "var(--apple-text-secondary)" }}>PAYLOAD</p><pre className="card p-3 text-xs font-mono overflow-x-auto" style={{ background: "var(--apple-gray)" }}>{payload}</pre>{exp && <p className="text-xs mt-1" style={{ color: exp < new Date() ? "#FF3B30" : "#34C759" }}>{exp < new Date() ? "Expired" : "Expires"} {exp.toLocaleString()}</p>}</div>
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
