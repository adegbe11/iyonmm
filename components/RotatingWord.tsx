"use client";
import { useState, useEffect } from "react";

// Cycles through words with a fade/slide animation. The first word is rendered
// server-side too, so crawlers still see a real keyword in the H1.
export default function RotatingWord({ words, interval = 2000 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span style={{ position: "relative", display: "inline-block", color: "var(--apple-blue)" }}>
      {/* Reserve width using the longest word so the line doesn't jump */}
      <span aria-hidden style={{ visibility: "hidden" }}>
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <span key={i} className="rotating-word" style={{ position: "absolute", left: 0, right: 0 }}>
        {words[i]}
      </span>
    </span>
  );
}
