"use client";
import { useState, useMemo } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "What does it check?", a: "Syntax errors, duplicate keys, missing values, spaces around the equals sign, unquoted values with spaces, and likely leaked secrets." },
  { q: "Is my .env file uploaded?", a: "No, and that matters here. Everything runs in your browser. Your secrets never leave your device." },
  { q: "Does it detect leaked keys?", a: "It flags values that look like API keys or tokens so you can double-check before committing." },
];

interface Issue { line: number; level: "error" | "warning"; message: string }

const SECRET_HINTS = [/sk-[a-z0-9]/i, /AKIA[0-9A-Z]{16}/, /ghp_[a-zA-Z0-9]/, /xox[baprs]-/, /-----BEGIN/, /[a-z0-9]{32,}/i];

function validate(text: string): Issue[] {
  const issues: Issue[] = [];
  const seen = new Map<string, number>();
  text.split("\n").forEach((raw, i) => {
    const line = i + 1;
    const t = raw.trim();
    if (!t || t.startsWith("#")) return;
    if (!t.includes("=")) { issues.push({ line, level: "error", message: "No '=' found. Expected KEY=value." }); return; }
    const eq = raw.indexOf("=");
    const key = raw.slice(0, eq);
    const value = raw.slice(eq + 1);
    if (!/^[A-Za-z_][A-Za-z0-9_]*\s*$/.test(key)) issues.push({ line, level: "error", message: `Invalid key name "${key.trim()}". Use letters, numbers, and underscores; don't start with a digit.` });
    if (key !== key.trimEnd() || value !== value.replace(/^\s+/, "") ) {
      if (/\s=$/.test(raw.slice(0, eq + 1)) || /^=\s/.test(raw.slice(eq))) issues.push({ line, level: "warning", message: "Spaces around '=' can break some parsers. Use KEY=value." });
    }
    const k = key.trim();
    if (seen.has(k)) issues.push({ line, level: "warning", message: `Duplicate key "${k}" (first set on line ${seen.get(k)}).` });
    else seen.set(k, line);
    if (value.trim() === "") issues.push({ line, level: "warning", message: `"${k}" has no value.` });
    const unquoted = value.trim();
    if (/\s/.test(unquoted) && !/^["'].*["']$/.test(unquoted)) issues.push({ line, level: "warning", message: `Value for "${k}" contains spaces but is not quoted.` });
    if (SECRET_HINTS.some((re) => re.test(value)) && unquoted.length > 8) issues.push({ line, level: "warning", message: `"${k}" looks like a secret or API key. Make sure this file is in .gitignore.` });
  });
  return issues;
}

export default function Client() {
  const [text, setText] = useState("");
  const issues = useMemo(() => validate(text), [text]);
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.filter((i) => i.level === "warning").length;

  return (
    <WidgetShell title=".env File Validator" subtitle="Check your .env file for syntax errors, duplicate keys, and leaked secrets, entirely in your browser. Nothing uploaded." badge="100% Client-side" faqs={faqs}
      related={[{ label: "JSON Formatter", href: "/json-formatter" }, { label: "Regex Tester", href: "/regex-tester" }]}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder={"DATABASE_URL=postgres://...\nAPI_KEY=your-key-here"} className="w-full border rounded-2xl p-4 text-sm font-mono outline-none focus:border-[#673DE6] resize-y mb-4" style={{ borderColor: "var(--apple-border)" }} />
      {text.trim() && (
        <div>
          <div className="flex gap-3 mb-3 text-sm">
            <span className="px-3 py-1 rounded-full font-semibold" style={{ background: errors ? "#FFF0F0" : "#EBF9EE", color: errors ? "#FF3B30" : "#34C759" }}>{errors} error{errors !== 1 ? "s" : ""}</span>
            <span className="px-3 py-1 rounded-full font-semibold" style={{ background: warnings ? "#FFF8E8" : "var(--apple-gray)", color: warnings ? "#FF9500" : "var(--apple-text-secondary)" }}>{warnings} warning{warnings !== 1 ? "s" : ""}</span>
          </div>
          {issues.length === 0 ? (
            <div className="card p-5 text-center"><p className="text-2xl mb-1">✅</p><p className="font-semibold text-sm">Looks good, no issues found.</p></div>
          ) : (
            <div className="space-y-2">
              {issues.map((iss, i) => (
                <div key={i} className="card px-4 py-3 flex items-start gap-3 text-sm">
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: "var(--apple-gray)" }}>L{iss.line}</span>
                  <span style={{ color: iss.level === "error" ? "#FF3B30" : "#FF9500" }}>{iss.level === "error" ? "✕" : "⚠"}</span>
                  <span>{iss.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </WidgetShell>
  );
}
