"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function Client() {
  const [stage, setStage] = useState<"idle" | "working" | "done">("idle");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState<2 | 4>(2);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0]; if (!file) return;
    setError(""); setFileName(file.name); setOriginalUrl(URL.createObjectURL(file));
    setStage("working"); setProgress(0); setStatus("Loading AI model (first run downloads it)...");
    try {
      const Upscaler = (await import("upscaler")).default;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const model: any = scale === 4
        ? (await import("@upscalerjs/esrgan-slim/4x")).default
        : (await import("@upscalerjs/esrgan-slim/2x")).default;
      const upscaler = new Upscaler({ model });
      setStatus(`Upscaling ${scale}x...`);
      const src = await fileToDataUrl(file);
      const out = await upscaler.upscale(src, {
        output: "base64",
        patchSize: 64,
        padding: 4,
        progress: (p: number) => setProgress(Math.round(p * 100)),
      });
      setResultUrl(out);
      setStage("done");
    } catch (e) {
      console.error(e);
      setError("Upscaling failed. Try a smaller image (under ~1500px works best in the browser).");
      setStage("idle");
    }
  }

  return (
    <ToolShell
      title="AI Image Upscaler"
      subtitle="Sharpen and enlarge blurry photos up to 4x with an AI model that runs in your browser. Free, no watermark, nothing uploaded."
      badge="AI · 100% Client-side"
      steps={[
        { icon: "🖼️", title: "Add your image", desc: "Drop in a JPG, PNG, or WebP. Smaller images work best." },
        { icon: "🤖", title: "AI upscales it", desc: "An on-device model adds detail at 2x or 4x." },
        { icon: "💾", title: "Download", desc: "Save the sharper, larger image." },
      ]}
      faqs={[
        { q: "Is it really free?", a: "Yes. It uses an open-source AI model that runs in your browser. No signup, no watermark." },
        { q: "Are my photos uploaded?", a: "No. The AI runs on your device. Your photo never leaves your browser." },
        { q: "Why is it slow or failing on big images?", a: "Upscaling is heavy AI work done on your device. Very large images can exhaust browser memory. Images under ~1500px on the long edge work best." },
        { q: "First run is slow, why?", a: "It downloads the AI model once, then caches it for next time." },
      ]}
      related={[{ label: "Compress Image", href: "/compress-image" }, { label: "Resize Image", href: "/resize-image" }, { label: "Remove Background", href: "/remove-background" }]}
    >
      <div>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}
        {stage === "idle" && (
          <>
            <div className="mb-4 flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <span className="text-sm font-medium">Scale</span>
              <button onClick={() => setScale(2)} className={`px-4 py-1.5 rounded-full text-sm border ${scale === 2 ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>2x</button>
              <button onClick={() => setScale(4)} className={`px-4 py-1.5 rounded-full text-sm border ${scale === 4 ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>4x</button>
            </div>
            <DropZone accept="image/jpeg,image/png,image/webp" onFiles={handleFile} label="Select image or drop image here" sublabel="JPG, PNG, WebP. Smaller images upscale faster." />
          </>
        )}
        {stage === "working" && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium mb-3">{status} {progress > 0 && progress < 100 ? `${progress}%` : ""}</p>
            {progress > 0 && <div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>}
          </div>
        )}
        {stage === "done" && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><p className="text-xs font-medium mb-2" style={{ color: "var(--apple-text-secondary)" }}>Original</p>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={originalUrl} alt="original" className="w-full rounded-xl" /></div>
              <div><p className="text-xs font-medium mb-2" style={{ color: "var(--apple-text-secondary)" }}>Upscaled {scale}x</p>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={resultUrl} alt="upscaled" className="w-full rounded-xl" /></div>
            </div>
            <div className="flex gap-3">
              <a href={resultUrl} download={fileName.replace(/\.[^.]+$/, "") + `-${scale}x.png`} className="btn-primary">Download</a>
              <button onClick={() => { setStage("idle"); setResultUrl(""); setOriginalUrl(""); }} className="btn-secondary">Upscale another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file); });
}
