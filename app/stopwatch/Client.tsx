"use client";
import { useState, useEffect, useRef } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "Is the stopwatch accurate?", a: "Yes. It tracks real elapsed time, so it stays accurate even if the tab is in the background." },
  { q: "Can I record laps?", a: "Yes. Hit Lap while running to record split times." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

function fmt(ms: number) {
  const t = Math.floor(ms / 10);
  const cs = String(t % 100).padStart(2, "0");
  const s = String(Math.floor(t / 100) % 60).padStart(2, "0");
  const m = String(Math.floor(t / 6000)).padStart(2, "0");
  return `${m}:${s}.${cs}`;
}

export default function Client() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => setElapsed(baseRef.current + (Date.now() - startRef.current)), 31);
    return () => clearInterval(id);
  }, [running]);

  function toggle() {
    if (running) { baseRef.current = elapsed; setRunning(false); }
    else setRunning(true);
  }
  function reset() { setRunning(false); setElapsed(0); baseRef.current = 0; setLaps([]); }
  function lap() { if (running) setLaps((l) => [elapsed, ...l]); }

  return (
    <WidgetShell title="Stopwatch" subtitle="A precise online stopwatch with lap times. Free, no signup, accurate in background tabs." badge="Instant" faqs={faqs}
      related={[{ label: "Timer", href: "/timer" }, { label: "Calculator", href: "/calculator" }]}>
      <div className="card p-8 text-center">
        <p className="font-bold tabular-nums" style={{ fontSize: "clamp(2.8rem, 13vw, 5.5rem)", lineHeight: 1 }}>{fmt(elapsed)}</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={toggle} className="btn-primary">{running ? "Pause" : "Start"}</button>
          <button onClick={lap} disabled={!running} className="btn-secondary disabled:opacity-40">Lap</button>
          <button onClick={reset} className="btn-secondary">Reset</button>
        </div>
        {laps.length > 0 && (
          <div className="mt-6 text-left max-w-xs mx-auto space-y-1 max-h-60 overflow-y-auto">
            {laps.map((l, i) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b" style={{ borderColor: "var(--apple-border)" }}>
                <span style={{ color: "var(--apple-text-secondary)" }}>Lap {laps.length - i}</span><span className="tabular-nums font-medium">{fmt(l)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  );
}
