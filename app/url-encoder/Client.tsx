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
    try { setOut(mode === "enc" ? encodeURIComponent(text) : decodeURIComponent(text)); }
    catch { setErr("Invalid input for decoding."); setOut(""); }
  }

  const faqs = [
    { q: "What does URL encoding do?", a: "It converts characters that are not safe in a URL (spaces, &, ?, etc.) into percent-encoded form so links and query strings work correctly." },
    { q: "Is my data uploaded?", a: "No. Everything runs in your browser. Nothing is sent anywhere." },
    { q: "Is it free?", a: "Yes, free with no signup." },
  ];

  return (
    <WidgetShell title="URL Encode / Decode" subtitle="Percent-encode text for safe use in URLs, or decode encoded URLs back to text. Free and private." badge="100% Client-side" faqs={faqs}
      related={[{ label: "Base64", href: "/base64" }, { label: "JSON Formatter", href: "/json-formatter" }, { label: "JWT Decoder", href: "/jwt-decoder" }]}>
      <div>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode("enc")} className={`px-4 py-1.5 rounded-full text-sm border ${mode === "enc" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Encode</button>
          <button onClick={() => setMode("dec")} className={`px-4 py-1.5 rounded-full text-sm border ${mode === "dec" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Decode</button>
        </div>
        {err && <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{err}</div>}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={mode === "enc" ? "Text to encode" : "Encoded URL to decode"} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y mb-3 break-all" style={{ borderColor: "var(--apple-border)" }} />
        <div className="flex gap-2 mb-3"><button onClick={run} className="btn-primary text-sm px-5 py-2">{mode === "enc" ? "Encode" : "Decode"}</button>{out && <button onClick={() => navigator.clipboard.writeText(out)} className="btn-secondary text-sm px-5 py-2">Copy</button>}</div>
        {out && <textarea value={out} readOnly rows={5} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none resize-y break-all" style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)" }} />}
      </div>
    </WidgetShell>
  );
}
