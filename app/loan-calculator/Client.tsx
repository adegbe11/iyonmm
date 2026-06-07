"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "How is the monthly payment calculated?", a: "We use the standard amortizing loan formula based on principal, annual interest rate, and term in years." },
  { q: "Does it work for mortgages and car loans?", a: "Yes. It works for any fixed-rate amortizing loan: mortgage, auto, personal, or student loans." },
  { q: "Is my data saved?", a: "No. All math runs in your browser. Nothing is stored or sent." },
];

function money(n: number) { return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }); }

export default function Client() {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const n = years * 12;
  const r = rate / 100 / 12;
  const monthly = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
  const total = monthly * n;
  const interest = total - principal;

  return (
    <WidgetShell title="Loan Calculator" subtitle="Estimate monthly payments and total interest for any fixed-rate loan: mortgage, auto, or personal. Free and instant." badge="Instant" faqs={faqs}
      related={[{ label: "Percentage Calculator", href: "/percentage-calculator" }, { label: "Calculator", href: "/calculator" }]}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Loan amount</label><input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm" style={{ borderColor: "var(--apple-border)" }} /></div>
          <div><label className="block text-sm font-medium mb-1">Annual interest rate: {rate}%</label><input type="range" min={0} max={25} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full accent-[#673DE6]" /></div>
          <div><label className="block text-sm font-medium mb-1">Term: {years} years</label><input type="range" min={1} max={40} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-[#673DE6]" /></div>
        </div>
        <div className="card p-6 flex flex-col justify-center">
          <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Monthly payment</p>
          <p className="text-4xl font-bold mb-4" style={{ color: "var(--apple-blue)" }}>{money(monthly)}</p>
          <div className="text-sm space-y-1" style={{ color: "var(--apple-text-secondary)" }}>
            <p>Total of {n} payments: <strong style={{ color: "var(--apple-black)" }}>{money(total)}</strong></p>
            <p>Total interest: <strong style={{ color: "var(--apple-black)" }}>{money(interest)}</strong></p>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
