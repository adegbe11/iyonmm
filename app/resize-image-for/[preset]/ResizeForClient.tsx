"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import type { ResizePreset } from "@/lib/seo-data";
import { resizePresets } from "@/lib/seo-data";

function resize(file: File, p: ResizePreset): Promise<Blob> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = p.width;
      canvas.height = p.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, p.width, p.height);

      const ir = img.naturalWidth / img.naturalHeight;
      const tr = p.width / p.height;
      let dw, dh, dx, dy;
      if (p.mode === "cover") {
        // Fill the frame, center-crop the overflow.
        if (ir > tr) { dh = p.height; dw = dh * ir; } else { dw = p.width; dh = dw / ir; }
        dx = (p.width - dw) / 2; dy = (p.height - dh) / 2;
      } else {
        // Fit fully inside, letterbox the rest.
        if (ir > tr) { dw = p.width; dh = dw / ir; } else { dh = p.height; dw = dh * ir; }
        dx = (p.width - dw) / 2; dy = (p.height - dh) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", 0.92);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

export default function ResizeForClient({ preset }: { preset: ResizePreset }) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setResult(null);
    try {
      const blob = await resize(file, preset);
      setResult({ url: URL.createObjectURL(blob), name: file.name });
    } catch (e) {
      console.error(e);
      alert("Could not resize that image. Try a JPG, PNG, or WebP file.");
    }
    setProcessing(false);
  }

  const others = resizePresets.filter((p) => p.slug !== preset.slug).slice(0, 6);

  return (
    <ToolShell
      title={`Resize Image for ${preset.name}`}
      subtitle={`Resize any photo to ${preset.width} x ${preset.height} pixels, the right size for ${preset.name}. ${preset.note} Nothing uploaded.`}
      badge="100% Client-side"
      steps={[
        { icon: "📁", title: "Add your image", desc: "Drop in a JPG, PNG, or WebP." },
        { icon: "📐", title: `Fit to ${preset.width} x ${preset.height}`, desc: preset.mode === "cover" ? "We scale and center-crop so it fills the frame perfectly." : "We scale it to fit fully inside the frame." },
        { icon: "💾", title: "Download", desc: `Save your ${preset.name} ready image.` },
      ]}
      faqs={[
        { q: `What is the correct size for ${preset.name}?`, a: `${preset.width} x ${preset.height} pixels. ${preset.note}` },
        { q: "Are my images uploaded?", a: "No. Resizing runs entirely in your browser. Your image never leaves your device." },
        { q: "Will the image look stretched?", a: preset.mode === "cover" ? "No. We scale to fill and center-crop, so the image keeps its proportions and never looks stretched." : "No. We fit the whole image inside the frame with no distortion." },
        { q: "Is this free?", a: "Yes. Free, no signup, no limits." },
      ]}
      related={[
        ...others.map((p) => ({ label: p.name, href: `/resize-image-for/${p.slug}` })),
        { label: "Compress Image", href: "/compress-image" },
      ]}
    >
      <div>
        {!processing && !result && (
          <DropZone accept="image/jpeg,image/png,image/webp" onFiles={handleFile} label="Select image or drop image here" sublabel="JPG, PNG, WebP. Any size works." />
        )}
        {processing && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Resizing to {preset.width} x {preset.height}...</p>
          </div>
        )}
        {result && (
          <div className="card p-6 text-center">
            <img src={result.url} alt="Resized" className="max-h-56 mx-auto rounded-xl mb-4 object-contain" style={{ background: "var(--apple-gray)" }} />
            <p className="font-bold text-lg mb-1">✅ Resized to {preset.width} x {preset.height}</p>
            <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>Ready for {preset.name}.</p>
            <div className="flex gap-3 justify-center">
              <a href={result.url} download={result.name.replace(/\.[^.]+$/, "") + `-${preset.slug}.jpg`} className="btn-primary">Download image</a>
              <button onClick={() => setResult(null)} className="btn-secondary">Resize another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
