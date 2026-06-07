"use client";
import { useState } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "How is age calculated?", a: "We compute the exact difference between your birth date and today, broken into years, months, and days." },
  { q: "Can I calculate age at a specific date?", a: "Yes. Change the 'as of' date to any date you want." },
  { q: "Is my birth date stored?", a: "No. Everything is computed in your browser and never sent anywhere." },
];

function diff(from: Date, to: Date) {
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) { m--; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const totalDays = Math.floor((to.getTime() - from.getTime()) / 86400000);
  return { y, m, d, totalDays };
}

export default function Client() {
  const today = new Date().toISOString().slice(0, 10);
  const [dob, setDob] = useState("2000-01-01");
  const [asOf, setAsOf] = useState(today);

  const from = new Date(dob); const to = new Date(asOf);
  const valid = !isNaN(from.getTime()) && !isNaN(to.getTime()) && to >= from;
  const r = valid ? diff(from, to) : null;

  return (
    <WidgetShell title="Age Calculator" subtitle="Find your exact age in years, months, and days, or the age between any two dates. Free and private." badge="Instant" faqs={faqs}
      related={[{ label: "Calculator", href: "/calculator" }, { label: "Percentage Calculator", href: "/percentage-calculator" }, { label: "Timer", href: "/timer" }]}>
      <div className="card p-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium mb-1">Date of birth</label><input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm" style={{ borderColor: "var(--apple-border)" }} /></div>
          <div><label className="block text-sm font-medium mb-1">Age as of</label><input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="w-full border rounded-xl px-4 py-2.5 text-sm" style={{ borderColor: "var(--apple-border)" }} /></div>
        </div>
        {r ? (
          <div className="text-center">
            <p className="text-4xl font-bold mb-2"><span style={{ color: "var(--apple-blue)" }}>{r.y}</span> yr <span style={{ color: "var(--apple-blue)" }}>{r.m}</span> mo <span style={{ color: "var(--apple-blue)" }}>{r.d}</span> d</p>
            <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>That is {r.totalDays.toLocaleString()} days, or {Math.floor(r.totalDays / 7).toLocaleString()} weeks.</p>
          </div>
        ) : <p className="text-sm text-center" style={{ color: "#FF3B30" }}>Pick a birth date on or before the &apos;as of&apos; date.</p>}
      </div>
    </WidgetShell>
  );
}
