"use client";
import { useState, useEffect, useCallback } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "Is this calculator free?", a: "Yes, free with no signup and no ads blocking the buttons." },
  { q: "Does it work on mobile?", a: "Yes. The buttons are large and the layout is fully responsive." },
  { q: "Can I use my keyboard?", a: "Yes. Type numbers and operators, Enter to equals, Backspace to delete, Esc to clear." },
];

export default function Client() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");

  const evaluate = useCallback(() => {
    if (!expr) return;
    try {
      const clean = expr.replace(/[^0-9+\-*/.()%\s]/g, "").replace(/%/g, "/100");
      // eslint-disable-next-line no-new-func
      const val = Function(`"use strict"; return (${clean})`)();
      if (val === undefined || val === null || Number.isNaN(val) || !Number.isFinite(val)) { setResult("Error"); return; }
      setResult(String(Math.round(val * 1e10) / 1e10));
    } catch { setResult("Error"); }
  }, [expr]);

  const press = useCallback((k: string) => {
    if (k === "=") { evaluate(); return; }
    if (k === "C") { setExpr(""); setResult("0"); return; }
    if (k === "DEL") { setExpr((e) => e.slice(0, -1)); return; }
    setExpr((e) => e + k);
  }, [evaluate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (/[0-9+\-*/.()%]/.test(e.key)) { setExpr((p) => p + e.key); }
      else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(); }
      else if (e.key === "Backspace") setExpr((p) => p.slice(0, -1));
      else if (e.key === "Escape") { setExpr(""); setResult("0"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [evaluate]);

  const keys = ["C", "(", ")", "DEL", "7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+"];

  return (
    <WidgetShell title="Calculator" subtitle="A fast, clean online calculator. Works with your keyboard, free, no signup." badge="Instant" faqs={faqs}
      related={[{ label: "Percentage Calculator", href: "/percentage-calculator" }, { label: "Loan Calculator", href: "/loan-calculator" }, { label: "Unit Converter", href: "/unit-converter" }]}>
      <div className="max-w-sm mx-auto">
        <div className="card p-5 mb-4 text-right">
          <p className="text-sm h-5 overflow-x-auto whitespace-nowrap" style={{ color: "var(--apple-text-secondary)" }}>{expr || " "}</p>
          <p className="text-4xl font-bold mt-1 truncate">{result}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map((k) => (
            <button key={k} onClick={() => press(k)}
              className="py-4 rounded-xl text-lg font-semibold transition-colors"
              style={k === "=" ? {} : { background: ["C", "DEL", "(", ")"].includes(k) ? "var(--apple-gray)" : "white", border: "1px solid var(--apple-border)" }}>
              {k === "DEL" ? "⌫" : k}
            </button>
          ))}
          <button onClick={() => press("=")} className="col-span-4 py-4 rounded-xl text-lg font-semibold btn-primary justify-center">=</button>
        </div>
      </div>
    </WidgetShell>
  );
}
