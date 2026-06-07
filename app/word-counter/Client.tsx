"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "What does it count?", a: "Words, characters (with and without spaces), sentences, paragraphs, and estimated reading time." },
  { q: "Is my text saved?", a: "No. Everything is counted in your browser. Nothing is sent or stored." },
  { q: "Is there a length limit?", a: "No. Paste as much text as you like." },
];

export default function Client() {
  const [text, setText] = useState("");
  const words = (text.trim().match(/\S+/g) || []).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
  const paragraphs = text.trim() ? text.trim().split(/\n+/).filter((p) => p.trim()).length : 0;
  const readMin = Math.max(1, Math.ceil(words / 200));

  const stats = [
    { label: "Words", value: words.toLocaleString() },
    { label: "Characters", value: chars.toLocaleString() },
    { label: "No spaces", value: charsNoSpace.toLocaleString() },
    { label: "Sentences", value: sentences.toLocaleString() },
    { label: "Paragraphs", value: paragraphs.toLocaleString() },
    { label: "Reading time", value: `${readMin} min` },
  ];

  return (
    <WidgetShell title="Word Counter" subtitle="Count words, characters, sentences, and reading time as you type. Free, instant, private." badge="Instant" faqs={faqs}
      related={[{ label: "JSON Formatter", href: "/json-formatter" }, { label: "Contract Risk Scanner", href: "/ai-legal-auditor" }]}>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-xl font-bold" style={{ color: "var(--apple-blue)" }}>{s.value}</p>
            <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>{s.label}</p>
          </div>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} placeholder="Start typing or paste your text here..." className="w-full border rounded-2xl p-4 text-sm outline-none focus:border-[#673DE6] resize-y" style={{ borderColor: "var(--apple-border)" }} />
    </WidgetShell>
  );
}
