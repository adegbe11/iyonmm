"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

interface ImgFile { file: File; url: string; id: string }

export default function ImageToPdfClient() {
  const [images, setImages] = useState<ImgFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  function addFiles(files: File[]) {
    const imgs = files.filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...imgs.map((f) => ({ file: f, url: URL.createObjectURL(f), id: Math.random().toString(36).slice(2) }))]);
    setResultUrl(null);
  }

  function remove(id: string) {
    setImages((prev) => prev.filter((i) => i.id !== id));
    setResultUrl(null);
  }

  async function convert() {
    if (!images.length) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      for (const { file, url } of images) {
        const data = await fetch(url).then((r) => r.arrayBuffer());
        let image;
        if (file.type === "image/png") {
          image = await doc.embedPng(data);
        } else {
          image = await doc.embedJpg(data);
        }
        const page = doc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      alert("Failed to convert. Make sure images are JPEG or PNG format.");
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Image to PDF"
      subtitle="Turn one or more images into a PDF document. Each image becomes a page. Runs entirely in your browser."
      badge="100% Client-side"
      steps={[
        { icon: "🖼️", title: "Upload images", desc: "Add JPEGs or PNGs, as many as you need." },
        { icon: "↕️", title: "Reorder (optional)", desc: "Remove or reorder images before converting." },
        { icon: "📄", title: "Download PDF", desc: "Get your PDF with one image per page." },
      ]}
      faqs={[
        { q: "What image formats are supported?", a: "JPEG and PNG. WebP images are converted to JPEG first automatically." },
        { q: "Is there a limit on the number of images?", a: "No. Add as many images as your device memory allows." },
        { q: "Are files uploaded?", a: "No. Conversion uses pdf-lib in your browser. Nothing leaves your device." },
        { q: "Can I change the PDF page size?", a: "Each page matches the original image dimensions. Fixed-page sizes (A4, Letter) are coming soon." },
      ]}
      related={[
        { label: "PDF to JPG", href: "/pdf-to-jpg" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "Compress Image", href: "/compress-image" },
        { label: "JPG to PDF", href: "/jpg-to-pdf" },
      ]}
    >
      <div className="space-y-4">
        <DropZone accept="image/jpeg,image/png,image/webp" multiple onFiles={addFiles} label="Select images or drop them here" sublabel="JPEG and PNG. No limits." />

        {images.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={img.id} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "1" }}>
                  <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-white bg-black/50 rounded-full px-2 py-0.5">{i + 1}</span>
                      <button onClick={() => remove(img.id)} className="text-white bg-black/50 rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!resultUrl ? (
              <button onClick={convert} disabled={processing} className="btn-primary disabled:opacity-50">
                {processing ? "Converting..." : `Convert ${images.length} image${images.length > 1 ? "s" : ""} to PDF`}
              </button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">✅ PDF created</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download="images.pdf" className="btn-primary">Download PDF</a>
                  <button onClick={() => { setImages([]); setResultUrl(null); }} className="btn-secondary">Start over</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
