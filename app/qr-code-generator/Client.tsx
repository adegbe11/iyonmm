"use client";
import { useState, useEffect } from "react";
import WidgetShell from "@/components/WidgetShell";

const faqs = [
  { q: "Is this QR code generator free?", a: "Yes, completely free with no limits and no signup." },
  { q: "Do the QR codes expire?", a: "No. The codes are static and never expire. They encode your data directly." },
  { q: "Can I use these commercially?", a: "Yes. The QR codes you generate are yours to use anywhere." },
  { q: "Is my data sent anywhere?", a: "No. The QR code is generated in your browser. Nothing is uploaded." },
];

export default function Client() {
  const [text, setText] = useState("https://www.iyonm.com");
  const [size, setSize] = useState(320);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [url, setUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!text.trim()) { setUrl(""); return; }
      const QRCode = (await import("qrcode")).default;
      try {
        const dataUrl = await QRCode.toDataURL(text, { width: size, margin: 2, color: { dark: fg, light: bg } });
        if (!cancelled) setUrl(dataUrl);
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [text, size, fg, bg]);

  return (
    <WidgetShell
      title="QR Code Generator"
      subtitle="Turn any link or text into a QR code in one click. Free, no signup, generated right in your browser."
      badge="100% Client-side"
      faqs={faqs}
      related={[{ label: "Compress Image", href: "/compress-image" }, { label: "Resize Image", href: "/resize-image" }]}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Link or text</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} placeholder="https://example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Size: {size}px</label>
            <input type="range" min={120} max={1024} step={8} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[#673DE6]" />
          </div>
          <div className="flex gap-4">
            <div><label className="block text-sm font-medium mb-1">Foreground</label><input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-16 h-10 rounded-lg cursor-pointer border-0" /></div>
            <div><label className="block text-sm font-medium mb-1">Background</label><input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-16 h-10 rounded-lg cursor-pointer border-0" /></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center card p-6">
          {url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="QR code" className="w-full max-w-[280px] rounded-xl" />
              <a href={url} download="qr-code.png" className="btn-primary mt-4">Download PNG</a>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Enter text to generate</p>
          )}
        </div>
      </div>
    </WidgetShell>
  );
}
