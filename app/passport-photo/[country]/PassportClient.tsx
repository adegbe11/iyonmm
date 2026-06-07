"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import type { PassportSpec } from "@/lib/seo-data";
import { passportSpecs } from "@/lib/seo-data";

function makePhoto(file: File, spec: PassportSpec): Promise<Blob> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = spec.width;
      canvas.height = spec.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, spec.width, spec.height);
      // Cover crop to exact passport dimensions.
      const ir = img.naturalWidth / img.naturalHeight;
      const tr = spec.width / spec.height;
      let dw, dh;
      if (ir > tr) { dh = spec.height; dw = dh * ir; } else { dw = spec.width; dh = dw / ir; }
      const dx = (spec.width - dw) / 2;
      const dy = (spec.height - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("encode failed"))), "image/jpeg", 0.95);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

export default function PassportClient({ spec }: { spec: PassportSpec }) {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setProcessing(true);
    setResult(null);
    try {
      const blob = await makePhoto(file, spec);
      setResult({ url: URL.createObjectURL(blob), name: file.name });
    } catch (e) {
      console.error(e);
      alert("Could not process that photo. Try a JPG or PNG.");
    }
    setProcessing(false);
  }

  const others = passportSpecs.filter((p) => p.slug !== spec.slug).slice(0, 6);

  return (
    <ToolShell
      title={`${spec.country} Passport Photo`}
      subtitle={`Resize and crop your photo to the official ${spec.country} passport size, ${spec.physical} (${spec.width} x ${spec.height} pixels). Nothing uploaded.`}
      badge="100% Client-side"
      steps={[
        { icon: "📷", title: "Add your photo", desc: "Use a clear, front facing photo against a plain background." },
        { icon: "✂️", title: `Fit to ${spec.physical}`, desc: "We crop and resize to the exact official dimensions." },
        { icon: "💾", title: "Download", desc: "Save your passport photo, ready to print or upload." },
      ]}
      faqs={[
        { q: `What size is a ${spec.country} passport photo?`, a: `${spec.physical}, which is ${spec.width} x ${spec.height} pixels at 300 DPI.` },
        { q: "Are my photos uploaded?", a: "No. Everything runs in your browser. Your photo never leaves your device." },
        { q: "Is this officially approved?", a: "This tool sizes your photo to the official dimensions. Always check current government rules for background, expression, and lighting before submitting." },
        { q: "Can I print it?", a: "Yes. The photo is exported at 300 DPI, suitable for printing at the listed physical size." },
      ]}
      related={[
        ...others.map((p) => ({ label: `${p.country} Passport`, href: `/passport-photo/${p.slug}` })),
        { label: "Resize Image", href: "/resize-image" },
      ]}
    >
      <div>
        {!processing && !result && (
          <DropZone accept="image/jpeg,image/png,image/webp" onFiles={handleFile} label="Select photo or drop photo here" sublabel="JPG, PNG, WebP. A clear front facing photo works best." />
        )}
        {processing && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Making your {spec.country} passport photo...</p>
          </div>
        )}
        {result && (
          <div className="card p-6 text-center">
            <img src={result.url} alt="Passport photo" className="max-h-56 mx-auto rounded-xl mb-4 object-contain" style={{ background: "var(--apple-gray)" }} />
            <p className="font-bold text-lg mb-1">✅ {spec.country} passport photo ready</p>
            <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>{spec.physical} · {spec.width} x {spec.height} px · 300 DPI</p>
            <div className="flex gap-3 justify-center">
              <a href={result.url} download={`passport-${spec.slug}.jpg`} className="btn-primary">Download photo</a>
              <button onClick={() => setResult(null)} className="btn-secondary">Make another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
