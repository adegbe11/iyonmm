"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "What units can I convert?", a: "Length (inches, cm, feet, meters, miles, km), weight (kg, lb, oz, g), and temperature (C, F, K)." },
  { q: "How accurate is it?", a: "It uses exact conversion factors and updates instantly as you type." },
  { q: "Is it free?", a: "Yes, free and private. Everything runs in your browser." },
];

const categories: Record<string, { units: Record<string, number> } | { temp: true }> = {
  Length: { units: { Inches: 0.0254, Centimeters: 0.01, Feet: 0.3048, Meters: 1, Miles: 1609.344, Kilometers: 1000, Millimeters: 0.001, Yards: 0.9144 } },
  Weight: { units: { Grams: 0.001, Kilograms: 1, Pounds: 0.45359237, Ounces: 0.0283495231, Stone: 6.35029318 } },
  Temperature: { temp: true },
};

function toC(v: number, u: string) { return u === "Celsius" ? v : u === "Fahrenheit" ? (v - 32) * 5 / 9 : v - 273.15; }
function fromC(c: number, u: string) { return u === "Celsius" ? c : u === "Fahrenheit" ? c * 9 / 5 + 32 : c + 273.15; }

export default function Client() {
  const [cat, setCat] = useState("Length");
  const cfg = categories[cat];
  const isTemp = "temp" in cfg;
  const units = isTemp ? ["Celsius", "Fahrenheit", "Kelvin"] : Object.keys((cfg as { units: Record<string, number> }).units);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [val, setVal] = useState(1);

  function convert(): number {
    if (isTemp) return fromC(toC(val, from), to);
    const u = (cfg as { units: Record<string, number> }).units;
    return (val * u[from]) / u[to];
  }
  const result = Math.round(convert() * 1e6) / 1e6;

  function switchCat(c: string) {
    setCat(c);
    const cc = categories[c];
    const us = "temp" in cc ? ["Celsius", "Fahrenheit", "Kelvin"] : Object.keys((cc as { units: Record<string, number> }).units);
    setFrom(us[0]); setTo(us[1]);
  }

  return (
    <WidgetShell title="Unit Converter" subtitle="Convert length, weight, and temperature instantly. Inches to cm, kg to lb, C to F, and more. Free." badge="Instant" faqs={faqs}
      related={[{ label: "Calculator", href: "/calculator" }, { label: "Percentage Calculator", href: "/percentage-calculator" }]}>
      <div className="card p-6">
        <div className="flex gap-2 mb-5 flex-wrap">
          {Object.keys(categories).map((c) => (
            <button key={c} onClick={() => switchCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium border ${cat === c ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>{c}</button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input type="number" value={val} onChange={(e) => setVal(+e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm mb-2" style={{ borderColor: "var(--apple-border)" }} />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white" style={{ borderColor: "var(--apple-border)" }}>{units.map((u) => <option key={u}>{u}</option>)}</select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <div className="w-full border rounded-xl px-4 py-2.5 text-sm mb-2 font-bold truncate" style={{ borderColor: "var(--apple-border)", background: "var(--apple-gray)", color: "var(--apple-blue)" }}>{result}</div>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white" style={{ borderColor: "var(--apple-border)" }}>{units.map((u) => <option key={u}>{u}</option>)}</select>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}
