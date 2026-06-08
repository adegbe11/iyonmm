"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function RemoveBgClient() {
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [error, setError] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError("");
    setFileName(file.name);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setProcessing(true);
    setProgress(10);
    setStatusMsg("Loading AI model...");

    try {
      // The package's default export is the removeBackground function (per @imgly docs).
      const mod = await import("@imgly/background-removal");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const removeBackground: (img: Blob, cfg?: any) => Promise<Blob> =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mod as any).default ?? (mod as any).removeBackground;
      if (typeof removeBackground !== "function") throw new Error("Background removal module failed to load.");
      setProgress(30);
      setStatusMsg("Removing background...");
      const blob: Blob = await removeBackground(file, {
        device: "cpu",
        model: "isnet_fp16",
        output: { format: "image/png" },
        progress: (_key: string, current: number, total: number) => {
          if (total) setProgress(30 + Math.round((current / total) * 60));
        },
      });
      setProgress(100);
      setResultUrl(URL.createObjectURL(blob));
      setStatusMsg("");
    } catch (e) {
      console.error("Background removal failed:", e);
      const msg = e instanceof Error ? e.message : String(e);
      setError(`Background removal failed: ${msg}. Try a smaller image, or a Chromium-based browser (Chrome, Edge, Brave).`);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Remove Background"
      subtitle="AI-powered background removal that runs entirely in your browser. No upload, no API key, instant transparent PNGs."
      badge="AI · 100% Client-side"
      steps={[
        { icon: "🖼️", title: "Upload image", desc: "Select a portrait, product, or any photo." },
        { icon: "🤖", title: "AI processes locally", desc: "A WebAssembly AI model isolates the subject, nothing is sent to a server." },
        { icon: "💾", title: "Download PNG", desc: "Save as a transparent PNG, ready for any design." },
      ]}
      faqs={[
        { q: "Is background removal really done in my browser?", a: "Yes. We use @imgly/background-removal, a WebAssembly AI model that runs 100% in your browser. Nothing is uploaded." },
        { q: "Why is the first run slow?", a: "The first run downloads the AI model (~50MB) to your browser cache. All subsequent runs are instant." },
        { q: "What types of images work best?", a: "Photos with a clear, distinct subject against a relatively contrasting background. People, products, and animals work great." },
        { q: "What format is the output?", a: "PNG with a transparent background, perfect for design tools, presentations, and web use." },
      ]}
      related={[
        { label: "Compress Image", href: "/compress-image" },
        { label: "Resize Image", href: "/resize-image" },
        { label: "Image to PDF", href: "/image-to-pdf" },
        { label: "Convert PNG to WebP", href: "/convert/png-to-webp" },
      ]}
    >
      <div className="space-y-4">
        {error && <div className="p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}
        {!processing && !resultUrl && (
          <DropZone accept="image/jpeg,image/png,image/webp" onFiles={handleFile} label="Select image or drop image here" sublabel="Works best with people, products, and animals" />
        )}

        {processing && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium mb-3">{statusMsg || "Processing..."} {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto mb-2">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            {progress < 35 && (
              <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>
                First run downloads the AI model (~50MB), cached after that.
              </p>
            )}
          </div>
        )}

        {resultUrl && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--apple-text-secondary)" }}>Original</p>
                {originalUrl && <img src={originalUrl} alt="Original" className="w-full rounded-2xl object-cover max-h-64" />}
              </div>
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--apple-text-secondary)" }}>Background removed</p>
                <div className="rounded-2xl overflow-hidden max-h-64 bg-[length:16px_16px]"
                  style={{ backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)", backgroundSize: "16px 16px", backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px" }}>
                  <img src={resultUrl} alt="Result" className="w-full object-contain max-h-64" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={resultUrl} download={fileName.replace(/\.[^.]+$/, "") + "-no-bg.png"} className="btn-primary">Download transparent PNG</a>
              <button onClick={() => { setResultUrl(null); setOriginalUrl(null); setProgress(0); }} className="btn-secondary">Remove another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
