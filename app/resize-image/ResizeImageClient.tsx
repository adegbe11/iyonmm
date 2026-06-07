"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function ResizeImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lock, setLock] = useState(true);
  const [mode, setMode] = useState<"px" | "pct">("px");
  const [pct, setPct] = useState(100);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");

  function loadFile(files: File[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setResultUrl(null);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = URL.createObjectURL(f);
  }

  function handleWidth(v: number) {
    setWidth(v);
    if (lock) setHeight(Math.round(v / origW * origH));
  }

  function handleHeight(v: number) {
    setHeight(v);
    if (lock) setWidth(Math.round(v / origH * origW));
  }

  function resize() {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const targetW = mode === "pct" ? Math.round(origW * pct / 100) : width;
      const targetH = mode === "pct" ? Math.round(origH * pct / 100) : height;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        setResultName(file.name.replace(/\.[^.]+$/, "") + `-${targetW}x${targetH}.jpg`);
      }, file.type || "image/jpeg", 0.92);
    };
    img.src = URL.createObjectURL(file);
  }

  return (
    <ToolShell
      title="Resize Image"
      subtitle="Change image dimensions by exact pixels or percentage. Runs entirely in your browser, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: "Upload image", desc: "Select a JPEG, PNG, or WebP." },
        { icon: "📐", title: "Set dimensions", desc: "Enter width/height in pixels or a percentage scale." },
        { icon: "💾", title: "Download", desc: "Save your resized image." },
      ]}
      faqs={[
        { q: "Can I maintain aspect ratio?", a: "Yes. The lock icon keeps aspect ratio. Disable it to set dimensions independently." },
        { q: "What formats are supported?", a: "JPEG, PNG, and WebP." },
        { q: "Are files uploaded?", a: "No. Resizing uses the browser's Canvas API. Nothing leaves your device." },
        { q: "Is there a size limit?", a: "No. Very large images may take a moment but there is no imposed limit." },
      ]}
      related={[
        { label: "Compress Image", href: "/compress-image" },
        { label: "Remove Background", href: "/remove-background" },
        { label: "Image to PDF", href: "/image-to-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!file ? (
          <DropZone accept="image/jpeg,image/png,image/webp" onFiles={loadFile} label="Select image or drop image here" sublabel="JPEG, PNG, WebP" />
        ) : (
          <>
            <div className="p-4 rounded-2xl flex items-center gap-3" style={{ background: "var(--apple-gray)" }}>
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>Original: {origW} × {origH}px</p>
              </div>
              <button onClick={() => { setFile(null); setResultUrl(null); }} className="ml-auto text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setMode("px")} className={`flex-1 py-2 rounded-xl text-sm border ${mode === "px" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Pixels</button>
              <button onClick={() => setMode("pct")} className={`flex-1 py-2 rounded-xl text-sm border ${mode === "pct" ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>Percentage</button>
            </div>

            {mode === "pct" ? (
              <div>
                <label className="text-sm font-medium block mb-1">Scale: {pct}%</label>
                <input type="range" min={1} max={400} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full accent-[#673DE6]" />
                <p className="text-xs mt-1" style={{ color: "var(--apple-text-secondary)" }}>
                  Output: {Math.round(origW * pct / 100)} × {Math.round(origH * pct / 100)}px
                </p>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <label className="text-xs font-medium block mb-1">Width (px)</label>
                  <input type="number" value={width} onChange={(e) => handleWidth(Number(e.target.value))} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} />
                </div>
                <button onClick={() => setLock(!lock)} className="mt-5 p-2 rounded-lg" style={{ background: lock ? "#EDE7FB" : "var(--apple-gray)" }} title={lock ? "Unlock aspect ratio" : "Lock aspect ratio"}>
                  {lock ? "🔒" : "🔓"}
                </button>
                <div className="flex-1">
                  <label className="text-xs font-medium block mb-1">Height (px)</label>
                  <input type="number" value={height} onChange={(e) => handleHeight(Number(e.target.value))} className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-[#673DE6]" style={{ borderColor: "var(--apple-border)" }} />
                </div>
              </div>
            )}

            {!resultUrl ? (
              <button onClick={resize} className="btn-primary">Resize Image</button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">✅ Resized successfully</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download={resultName} className="btn-primary">Download</a>
                  <button onClick={() => setResultUrl(null)} className="btn-secondary">Resize again</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
