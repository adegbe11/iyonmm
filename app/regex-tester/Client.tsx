"use client";
import { useState, useMemo } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "What regex flavor is this?", a: "JavaScript regular expressions, the same engine used in browsers and Node.js." },
  { q: "Does it highlight matches?", a: "Yes. Every match in your test text is highlighted, with capture groups listed below." },
  { q: "Is my data sent anywhere?", a: "No. The regex runs in your browser. Nothing is uploaded." },
];

export default function Client() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact us at hello@iyonm.com or support@example.org.");

  const { error, matches, html } = useMemo(() => {
    if (!pattern) return { error: "", matches: [], html: text };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const found: { match: string; groups: string[] }[] = [];
      let html = ""; let last = 0; let m;
      const reExec = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      while ((m = reExec.exec(text)) !== null) {
        found.push({ match: m[0], groups: m.slice(1) });
        html += esc(text.slice(last, m.index)) + `<mark style="background:#FFE9A8;border-radius:3px">${esc(m[0]) || "∅"}</mark>`;
        last = m.index + m[0].length;
        if (m[0] === "") reExec.lastIndex++;
      }
      html += esc(text.slice(last));
      return { error: "", matches: found, html };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid regex", matches: [], html: esc(text) };
    }
  }, [pattern, flags, text]);

  return (
    <WidgetShell title="Regex Tester" subtitle="Write and test JavaScript regular expressions with live match highlighting and capture groups. Free and private." badge="Instant" faqs={faqs}
      related={[{ label: "JSON Formatter", href: "/json-formatter" }, { label: ".env Validator", href: "/env-validator" }]}>
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span style={{ color: "var(--apple-text-secondary)" }}>/</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} className="flex-1 border rounded-lg px-3 py-2 outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} />
          <span style={{ color: "var(--apple-text-secondary)" }}>/</span>
          <input value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))} className="w-20 border rounded-lg px-3 py-2 outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} placeholder="flags" />
        </div>
        {error && <p className="text-sm mt-2" style={{ color: "#FF3B30" }}>{error}</p>}
      </div>
      <label className="block text-sm font-medium mb-1">Test text</label>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y mb-4" style={{ borderColor: "var(--apple-border)" }} />
      <div className="card p-4 mb-4">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--apple-text-secondary)" }}>{matches.length} match{matches.length !== 1 ? "es" : ""}</p>
        <p className="text-sm font-mono whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      {matches.some((m) => m.groups.length > 0) && (
        <div className="card p-4 text-sm font-mono">
          {matches.map((m, i) => m.groups.length > 0 && (
            <div key={i} className="mb-1">Match {i + 1}: {m.groups.map((g, j) => <span key={j} className="mr-2"><span style={{ color: "var(--apple-text-secondary)" }}>${j + 1}=</span>{g ?? "undefined"}</span>)}</div>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
