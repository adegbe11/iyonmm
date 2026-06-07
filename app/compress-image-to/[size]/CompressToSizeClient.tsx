"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import type { CompressTarget } from "@/lib/seo-data";
import { compressTargets } from "@/lib/seo-data";

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// Render image to a canvas at a given scale, then export as JPEG at a given quality.
function draw(img: HTMLImageElement, scale: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", quality));
}

// Hit a target byte size: binary-search quality first; if still too big, downscale and retry.
async function compressToTarget(file: File, targetBytes: number): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });

  let scale = 1;
  let best: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    const canvas = draw(img, scale);
    let lo = 0.1, hi = 0.95, found: Blob | null = null;
    for (let i = 0; i < 8; i++) {
      const q = (lo + hi) / 2;
      const blob = await toBlob(canvas, q);
      if (blob.size <= targetBytes) {
        found = blob;
        lo = q; // try higher quality
      } else {
        hi = q; // need smaller
      }
    }
    if (found) return found;
    // Nothing fit even at lowest quality: keep the smallest we have and downscale.
    const smallest = await toBlob(canvas, 0.1);
    if (!best || smallest.size < best.size) best = smallest;
    if (smallest.size <= targetBytes) return smallest;
    scale *= 0.75;
  }
  return best!;
}

export default function CompressToSizeClient({ target }: { target: CompressTarget }) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; original: number; name: string; hit: boolean } | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setResult(null);
    try {
      const blob = await compressToTarget(file, target.bytes);
      setResult({ url: URL.createObjectURL(blob), size: blob.size, original: file.size, name: file.name, hit: blob.size <= target.bytes });
    } catch (e) {
      console.error(e);
      alert("Could not compress that image. Try a JPG, PNG, or WebP file.");
    }
    setProcessing(false);
  }

  const others = compressTargets.filter((t) => t.slug !== target.slug).slice(0, 6);

  return (
    <ToolShell
      title={`Compress Image to ${target.label}`}
      subtitle={`Shrink any JPG, PNG, or WebP down to ${target.label} or under. Great for online forms, job and college applications, and email. Nothing uploaded.`}
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: "Add your image", desc: "Drop in a JPG, PNG, or WebP of any size." },
        { icon: "🎯", title: `We hit ${target.label}`, desc: `We lower quality and size automatically until the file fits ${target.label}.` },
        { icon: "💾", title: "Download", desc: "Save the compressed image ready to upload." },
      ]}
      faqs={[
        { q: `How do I compress an image to exactly ${target.label}?`, a: `Just drop your image. We automatically adjust quality, and downscale if needed, until the file is at or under ${target.label}.` },
        { q: "Are my images uploaded to a server?", a: "No. All compression runs in your browser. Your images never leave your device." },
        { q: "Why do forms ask for a specific size?", a: "Government portals, job boards, and college applications often cap upload sizes. This tool gets you under the cap without guesswork." },
        { q: "What if my image cannot reach the target?", a: "Tiny targets on very large photos may need heavy downscaling. We get as close as possible and show you the final size." },
      ]}
      related={[
        ...others.map((t) => ({ label: `Compress to ${t.label}`, href: `/compress-image-to/${t.slug}` })),
        { label: "Resize Image", href: "/resize-image" },
      ]}
    >
      <div>
        {!processing && !result && (
          <DropZone accept="image/jpeg,image/png,image/webp" onFiles={handleFile} label="Select image or drop image here" sublabel="JPG, PNG, WebP. Any size works." />
        )}
        {processing && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Compressing to {target.label}...</p>
          </div>
        )}
        {result && (
          <div className="card p-6 text-center">
            <img src={result.url} alt="Compressed" className="max-h-48 mx-auto rounded-xl mb-4 object-contain" />
            <p className="font-bold text-lg mb-1">
              {result.hit ? `✅ Compressed to ${fmtSize(result.size)}` : `Closest we could reach: ${fmtSize(result.size)}`}
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>
              {fmtSize(result.original)} down to {fmtSize(result.size)}
              {result.hit && <span className="ml-2 font-semibold" style={{ color: "#34C759" }}>under {target.label}</span>}
            </p>
            <div className="flex gap-3 justify-center">
              <a href={result.url} download={result.name.replace(/\.[^.]+$/, "") + `-${target.slug}.jpg`} className="btn-primary">Download image</a>
              <button onClick={() => setResult(null)} className="btn-secondary">Compress another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
