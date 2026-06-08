"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export default function Client() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [err, setErr] = useState("");

  function run() {
    setErr("");
    try {
      if (mode === "enc") setOut(btoa(unescape(encodeURIComponent(text))));
      else setOut(decodeURIComponent(escape(atob(text.trim()))));
    } catch { setErr("Invalid input for this mode."); setOut(""); }
  }

  const faqs = [
    { q: "Is my data uploaded?", a: "No. Encoding and decoding run entirely in your browser. Nothing is sent anywhere." },
    { q: "Does it handle Unicode?", a: "Yes. UTF-8 text with emojis and accents encodes and decodes correctly." },
    { q: "Is it free?", a: "Yes, free with no limits and no signup." },
  ];

  return (
    <WidgetShell title="Base64 Encode / Decode" subtitle="Convert text to Base64 and back, instantly and privately in your browser." badge="100% Client-side" faqs={faqs}
      related={[{ label: "URL Encoder", href: "/url-encoder" }, { label: "JWT Decoder", href: "/jwt-decoder" }, { label: "Hash Generator", href: "/hash-generator" }]}>
      <div>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode("enc")} className={`px-4 py-1.5 rounded-full text-sm border ${mode === "enc" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Encode</button>
          <button onClick={() => setMode("dec")} className={`px-4 py-1.5 rounded-full text-sm border ${mode === "dec" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Decode</button>
        </div>
        {err && <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{err}</div>}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder={mode === "enc" ? "Text to encode" : "Base64 to decode"} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y mb-3" style={{ borderColor: "var(--apple-border)" }} />
        <div className="flex gap-2 mb-3"><button onClick={run} className="btn-primary text-sm px-5 py-2">{mode === "enc" ? "Encode" : "Decode"}</button>{out && <button onClick={() => navigator.clipboard.writeText(out)} className="btn-secondary text-sm px-5 py-2">Copy result</button>}</div>
        {out && <textarea value={out} readOnly rows={6} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none resize-y" style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)" }} />}
      </div>
    </WidgetShell>
  );
}
