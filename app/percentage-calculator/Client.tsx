"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "How do I calculate a percentage of a number?", a: "Enter the percentage and the number, e.g. 20% of 150 = 30." },
  { q: "Can it calculate percentage change?", a: "Yes. Use the 'percentage change' mode to find the increase or decrease between two numbers." },
  { q: "Is it free?", a: "Yes, free with no signup. Everything runs in your browser." },
];

function fmt(n: number) { return Number.isFinite(n) ? String(Math.round(n * 1e6) / 1e6) : "—"; }

export default function Client() {
  const [a1, setA1] = useState(20); const [a2, setA2] = useState(150);
  const [b1, setB1] = useState(30); const [b2, setB2] = useState(150);
  const [c1, setC1] = useState(100); const [c2, setC2] = useState(125);

  return (
    <WidgetShell title="Percentage Calculator" subtitle="Work out percentages, percentage of a number, and percentage change. Free and instant." badge="Instant" faqs={faqs}
      related={[{ label: "Calculator", href: "/calculator" }, { label: "Loan Calculator", href: "/loan-calculator" }, { label: "Age Calculator", href: "/age-calculator" }]}>
      <div className="space-y-4">
        <div className="card p-5">
          <p className="font-semibold text-sm mb-3">What is X% of Y?</p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <input type="number" value={a1} onChange={(e) => setA1(+e.target.value)} className="w-24 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} /> % of
            <input type="number" value={a2} onChange={(e) => setA2(+e.target.value)} className="w-28 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} /> =
            <span className="font-bold text-lg" style={{ color: "var(--apple-blue)" }}>{fmt((a1 / 100) * a2)}</span>
          </div>
        </div>
        <div className="card p-5">
          <p className="font-semibold text-sm mb-3">X is what percent of Y?</p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <input type="number" value={b1} onChange={(e) => setB1(+e.target.value)} className="w-24 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} /> is
            <input type="number" value={b2} onChange={(e) => setB2(+e.target.value)} className="w-28 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} /> →
            <span className="font-bold text-lg" style={{ color: "var(--apple-blue)" }}>{fmt((b1 / b2) * 100)}%</span>
          </div>
        </div>
        <div className="card p-5">
          <p className="font-semibold text-sm mb-3">Percentage change from X to Y</p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            from <input type="number" value={c1} onChange={(e) => setC1(+e.target.value)} className="w-24 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} />
            to <input type="number" value={c2} onChange={(e) => setC2(+e.target.value)} className="w-24 border rounded-lg px-3 py-2" style={{ borderColor: "var(--apple-border)" }} /> →
            <span className="font-bold text-lg" style={{ color: c2 >= c1 ? "#34C759" : "#FF3B30" }}>{c2 >= c1 ? "+" : ""}{fmt(((c2 - c1) / Math.abs(c1)) * 100)}%</span>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
