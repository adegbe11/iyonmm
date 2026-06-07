"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface Result {
  name: string;
  originalSize: number;
  compressedSize: number;
  url: string;
  type: string;
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function compressImage(file: File, quality: number): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas error")); return; }
      ctx.drawImage(img, 0, 0);
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl);
        if (!blob) { reject(new Error("Compression failed")); return; }
        resolve({ blob, url: URL.createObjectURL(blob) });
      }, mimeType, quality / 100);
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

export default function CompressImageClient() {
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
      const file = files[i];
      try {
        const { blob, url } = await compressImage(file, quality);
        out.push({ name: file.name, originalSize: file.size, compressedSize: blob.size, url, type: blob.type });
      } catch {
        console.error("Failed to compress", file.name);
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
      a.download = r.name.replace(/\.[^.]+$/, "") + "-compressed" + (r.type === "image/png" ? ".png" : ".jpg");
      a.click();
    });
  }

  return (
    <ToolShell
      title="Compress Image"
      subtitle="Reduce image file size without losing quality. Files processed entirely in your browser, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: "Upload images", desc: "Drop JPEGs, PNGs, or WebPs, any number, any size." },
        { icon: "🎚️", title: "Set quality", desc: "Drag the slider to choose your quality vs. size trade-off." },
        { icon: "💾", title: "Download", desc: "Save the compressed files individually or all at once." },
      ]}
      faqs={[
        { q: "Are my images uploaded to a server?", a: "No. Compression runs entirely in your browser using the Canvas API. Your images never leave your device." },
        { q: "What formats are supported?", a: "JPEG, PNG, and WebP images are fully supported." },
        { q: "Is there a file size or quantity limit?", a: "No. Process as many files as you want, as large as your device allows." },
        { q: "How much will my images be compressed?", a: "At 80% quality, most images shrink by 60-75% with no visible quality loss. Adjust the slider for more or less compression." },
      ]}
      related={[
        { label: "Resize Image", href: "/resize-image" },
        { label: "Remove Background", href: "/remove-background" },
        { label: "Image to PDF", href: "/image-to-pdf" },
        { label: "Convert PNG to JPG", href: "/convert/png-to-jpg" },
      ]}
    >
      <div>
        <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
          <label className="text-sm font-medium">Quality</label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="flex-1 accent-[#673DE6]"
          />
          <span className="text-sm font-semibold w-10 text-right">{quality}%</span>
        </div>

        {!processing && results.length === 0 && (
          <DropZone
            accept="image/jpeg,image/png,image/webp"
            multiple
            onFiles={handleFiles}
            label="Select images or drop them here"
            sublabel="JPEG, PNG, WebP. Any size, as many as you want."
          />
        )}

        {processing && (
          <div className="py-16 text-center">
            <p className="text-sm font-medium mb-4">Compressing... {progress}%</p>
            <div className="progress-bar max-w-xs mx-auto">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">{results.length} file{results.length > 1 ? "s" : ""} compressed</p>
              <div className="flex gap-2">
                <button onClick={() => { setResults([]); }} className="btn-secondary text-sm px-4 py-2">Compress more</button>
                {results.length > 1 && (
                  <button onClick={downloadAll} className="btn-primary text-sm px-4 py-2">Download all</button>
                )}
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
                        {fmtSize(r.originalSize)} → {fmtSize(r.compressedSize)}
                        {saving > 0 && <span className="ml-2 font-semibold" style={{ color: "#34C759" }}>-{saving}%</span>}
                      </p>
                    </div>
                    <a href={r.url} download={r.name.replace(/\.[^.]+$/, "") + "-compressed" + (r.type === "image/png" ? ".png" : ".jpg")} className="btn-primary text-sm px-4 py-2">
                      Download
                    </a>
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
