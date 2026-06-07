"use client";
import { useState, useEffect, useRef } from "react";
import WidgetShell from "@/components/WidgetShell";

export const faqs = [
  { q: "Does the timer keep running if I switch tabs?", a: "Yes. It tracks real elapsed time, so it stays accurate even in a background tab." },
  { q: "Will it alert me when time is up?", a: "Yes. It plays a sound when the countdown reaches zero (make sure your volume is on)." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination); o.frequency.value = 880; o.type = "sine";
    g.gain.setValueAtTime(0.5, ctx.currentTime); o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2); o.stop(ctx.currentTime + 1.2);
  } catch { /* ignore */ }
}

export default function Client() {
  const [mins, setMins] = useState(5);
  const [secs, setSecs] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) { setRunning(false); beep(); }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  function start() {
    const total = remaining > 0 && running === false && remaining !== 0 ? remaining : mins * 60 + secs;
    if (total <= 0) return;
    endRef.current = Date.now() + total * 1000;
    setRemaining(total); setRunning(true);
  }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setRemaining(0); }

  const show = running || remaining > 0 ? remaining : mins * 60 + secs;
  const mm = String(Math.floor(show / 60)).padStart(2, "0");
  const ss = String(show % 60).padStart(2, "0");

  return (
    <WidgetShell title="Timer" subtitle="A simple, accurate online countdown timer with a sound alert. Free, no signup." badge="Instant" faqs={faqs}
      related={[{ label: "Stopwatch", href: "/stopwatch" }, { label: "Calculator", href: "/calculator" }]}>
      <div className="card p-8 text-center">
        <p className="font-bold tabular-nums" style={{ fontSize: "clamp(3rem, 14vw, 6rem)", lineHeight: 1, color: show === 0 && remaining === 0 && !running ? "var(--apple-text-secondary)" : "var(--apple-black)" }}>{mm}:{ss}</p>
        {!running && remaining === 0 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            <input type="number" min={0} max={99} value={mins} onChange={(e) => setMins(Math.max(0, +e.target.value))} className="w-20 border rounded-xl px-3 py-2 text-center" style={{ borderColor: "var(--apple-border)" }} /> min
            <input type="number" min={0} max={59} value={secs} onChange={(e) => setSecs(Math.min(59, Math.max(0, +e.target.value)))} className="w-20 border rounded-xl px-3 py-2 text-center" style={{ borderColor: "var(--apple-border)" }} /> sec
          </div>
        )}
        <div className="flex gap-3 justify-center mt-6">
          {!running ? <button onClick={start} className="btn-primary">Start</button> : <button onClick={pause} className="btn-secondary">Pause</button>}
          <button onClick={reset} className="btn-secondary">Reset</button>
        </div>
      </div>
    </WidgetShell>
  );
}
