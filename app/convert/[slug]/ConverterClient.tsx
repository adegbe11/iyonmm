"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import type { ConvertConfig } from "@/lib/converters";

interface Result { name: string; url: string; originalSize: number; convertedSize: number }

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function convertImage(file: File, toMime: string, outputExt: string): Promise<Result> {
  // Special HEIC handling
  if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic")) {
    const heic2any = (await import("heic2any")).default;
    const blob = await heic2any({ blob: file, toType: toMime, quality: 0.92 }) as Blob;
    return { name: file.name.replace(/\.[^.]+$/, "") + "." + outputExt, url: URL.createObjectURL(blob), originalSize: file.size, convertedSize: blob.size };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (toMime === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(src);
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Conversion failed")); return; }
        resolve({ name: file.name.replace(/\.[^.]+$/, "") + "." + outputExt, url: URL.createObjectURL(blob), originalSize: file.size, convertedSize: blob.size });
      }, toMime, 0.92);
    };
    img.onerror = reject;
    img.src = src;
  });
}

export default function ConverterClient({ config }: { config: ConvertConfig }) {
  const [results, setResults] = useState<Result[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFiles(files: File[]) {
    setProcessing(true);
    setResults([]);
    setProgress(0);
    const out: Result[] = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const r = await convertImage(files[i], config.toMime, config.outputExt);
        out.push(r);
      } catch (e) {
        console.error("Failed to convert", files[i].name, e);
      }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setResults(out);
    setProcessing(false);
  }

  function downloadAll() {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name;
      a.click();
    });
  }

  return (
    <ToolShell
      title={`${config.from} to ${config.to} Converter`}
      subtitle={`Convert ${config.from} files to ${config.to} format instantly in your browser. Nothing uploaded, no limits.`}
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: `Upload ${config.from}`, desc: `Select one or more ${config.from} files from your device.` },
        { icon: "⚡", title: "Auto-convert", desc: `Files are converted to ${config.to} in your browser instantly.` },
        { icon: "💾", title: "Download", desc: `Save your ${config.to} files individually or all at once.` },
      ]}
      faqs={[
        { q: `Are my ${config.from} files uploaded?`, a: "No. Conversion runs entirely in your browser. Files never leave your device." },
        { q: `Is there a limit on how many files I can convert?`, a: "No. Convert as many files as you want at once." },
        { q: `Will the ${config.to} file lose quality?`, a: config.toMime === "image/jpeg" ? "JPEG uses lossy compression. We default to 92% quality, which is indistinguishable from the original for most images." : "PNG and WebP conversions are lossless, no quality is lost." },
        { q: "Is this free?", a: "Yes. IyonM is completely free with no limits and no signup required." },
      ]}
      related={[
        { label: "Compress Image", href: "/compress-image" },
        { label: "Resize Image", href: "/resize-image" },
        { label: "Image to PDF", href: "/image-to-pdf" },
        { label: "Remove Background", href: "/remove-background" },
      ]}
    >
      <div>
        {!processing && results.length === 0 && (
          <DropZone
            accept={config.fromMime}
            multiple
            onFiles={handleFiles}
            label={`Select ${config.from} files or drop them here`}
            sublabel={`Convert as many files as you want at once`}
          />
        )}

        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Converting... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">{results.length} file{results.length > 1 ? "s" : ""} converted</p>
              <div className="flex gap-2">
                <button onClick={() => setResults([])} className="btn-secondary text-sm px-4 py-2">Convert more</button>
                {results.length > 1 && <button onClick={downloadAll} className="btn-primary text-sm px-4 py-2">Download all</button>}
              </div>
            </div>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className="card p-4 flex items-center gap-4">
                  {config.to !== "PDF" && <img src={r.url} alt={r.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>
                      {fmtSize(r.originalSize)} → {fmtSize(r.convertedSize)}
                    </p>
                  </div>
                  <a href={r.url} download={r.name} className="btn-primary text-sm px-4 py-2">Download</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
