"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import type { CompressFormat } from "@/lib/seo-data";

interface Result { name: string; originalSize: number; compressedSize: number; url: string }

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function compress(file: File, mime: string, quality: number): Promise<Blob> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (mime === "image/jpeg") { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), mime, quality);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

export default function CompressFormatClient({ format }: { format: CompressFormat }) {
  const [quality, setQuality] = useState(80);
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
        const blob = await compress(files[i], format.outMime, quality / 100);
        out.push({ name: files[i].name, originalSize: files[i].size, compressedSize: blob.size, url: URL.createObjectURL(blob) });
      } catch { /* skip */ }
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    setResults(out);
    setProcessing(false);
  }

  function downloadAll() {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name.replace(/\.[^.]+$/, "") + "-compressed." + format.outExt;
      a.click();
    });
  }

  return (
    <ToolShell
      title={`Compress ${format.name}`}
      subtitle={`${format.blurb} Everything runs in your browser, nothing uploaded.`}
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: `Add ${format.name} files`, desc: `Drop in your ${format.name} images, any number, any size.` },
        { icon: "🎚️", title: "Set quality", desc: "Use the slider to balance size against quality." },
        { icon: "💾", title: "Download", desc: "Save your smaller images one by one or all at once." },
      ]}
      faqs={[
        { q: `Are my ${format.name} files uploaded?`, a: "No. Compression runs in your browser. Your files never leave your device." },
        { q: `How much smaller will my ${format.name} get?`, a: format.lossless ? "PNG is lossless, so savings depend on the image. Photos saved as PNG can shrink a lot when re-optimized." : "At 80% quality most images shrink 60 to 75% with no visible difference." },
        { q: "Is there a limit?", a: "No. Compress as many files as you want, at any size." },
        { q: "Do you need a specific file size?", a: "If you need an exact size like 100 KB, use our Compress Image to size tool." },
      ]}
      related={[
        { label: "Compress to 100 KB", href: "/compress-image-to/100kb" },
        { label: "Resize Image", href: "/resize-image" },
        { label: "Compress Image", href: "/compress-image" },
        { label: `Convert ${format.name} to PNG`, href: `/convert/${format.slug === "png" ? "png-to-jpg" : format.slug + "-to-png"}` },
      ]}
    >
      <div>
        <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
          <label className="text-sm font-medium">Quality</label>
          <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="flex-1 accent-[#673DE6]" />
          <span className="text-sm font-semibold w-10 text-right">{quality}%</span>
        </div>

        {!processing && results.length === 0 && (
          <DropZone accept={format.accept} multiple onFiles={handleFiles} label={`Select ${format.name} files or drop them here`} sublabel={`${format.name} images. Any size, as many as you want.`} />
        )}

        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Compressing... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">{results.length} file{results.length > 1 ? "s" : ""} compressed</p>
              <div className="flex gap-2">
                <button onClick={() => setResults([])} className="btn-secondary text-sm px-4 py-2">Compress more</button>
                {results.length > 1 && <button onClick={downloadAll} className="btn-primary text-sm px-4 py-2">Download all</button>}
              </div>
            </div>
            <div className="space-y-3">
              {results.map((r, i) => {
                const saving = Math.round((1 - r.compressedSize / r.originalSize) * 100);
                return (
                  <div key={i} className="card p-4 flex items-center gap-4">
                    <img src={r.url} alt={r.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>
                        {fmtSize(r.originalSize)} to {fmtSize(r.compressedSize)}
                        {saving > 0 && <span className="ml-2 font-semibold" style={{ color: "#34C759" }}>-{saving}%</span>}
                      </p>
                    </div>
                    <a href={r.url} download={r.name.replace(/\.[^.]+$/, "") + "-compressed." + format.outExt} className="btn-primary text-sm px-4 py-2">Download</a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
