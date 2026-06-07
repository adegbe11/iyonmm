"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function Client() {
  const [shots, setShots] = useState<string[]>([]); // data URLs
  const [camOn, setCamOn] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  async function startCam() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = s; setCamOn(true);
      setTimeout(() => { if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); } }, 50);
    } catch { alert("Could not access the camera. You can upload images instead."); }
  }
  function stopCam() { streamRef.current?.getTracks().forEach((t) => t.stop()); setCamOn(false); }
  function capture() {
    const v = videoRef.current!; const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight; c.getContext("2d")!.drawImage(v, 0, 0);
    setShots((s) => [...s, c.toDataURL("image/jpeg", 0.9)]); setResultUrl(null);
  }
  async function addFiles(files: File[]) {
    const urls = await Promise.all(files.map((f) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); })));
    setShots((s) => [...s, ...urls]); setResultUrl(null);
  }
  function remove(i: number) { setShots((s) => s.filter((_, k) => k !== i)); setResultUrl(null); }

  async function build() {
    if (!shots.length) return; setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      for (const url of shots) {
        const img = url.startsWith("data:image/png") ? await doc.embedPng(url) : await doc.embedJpg(url);
        const p = doc.addPage([img.width, img.height]); p.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const data = await doc.save();
      setResultUrl(URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "application/pdf" })));
    } catch (e) { console.error(e); alert("Could not build the PDF."); }
    setBusy(false);
  }

  return (
    <ToolShell title="Scan to PDF" subtitle="Snap document photos with your camera or drop in images, then save them as one PDF. Nothing uploaded." badge="100% Client-side"
      steps={[{ icon: "📷", title: "Capture or upload", desc: "Use your camera or add image files." }, { icon: "🗂️", title: "Arrange", desc: "Each shot becomes a page." }, { icon: "💾", title: "Download", desc: "Save your scanned PDF." }]}
      faqs={[{ q: "Are my scans uploaded?", a: "No. Images and the PDF are created in your browser." }, { q: "Does the camera work on mobile?", a: "Yes. It uses the rear camera where available." }, { q: "What image formats can I add?", a: "JPG and PNG." }, { q: "Is it free?", a: "Yes, free with no limits." }]}
      related={[{ label: "Image to PDF", href: "/image-to-pdf" }, { label: "OCR PDF", href: "/ocr-pdf" }, { label: "Compress PDF", href: "/compress-pdf" }]}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {!camOn ? <button onClick={startCam} className="btn-primary text-sm">📷 Use camera</button> : <><button onClick={capture} className="btn-primary text-sm">Capture</button><button onClick={stopCam} className="btn-secondary text-sm">Stop camera</button></>}
        </div>
        {camOn && <video ref={videoRef} className="w-full max-w-md rounded-2xl" style={{ border: "1px solid var(--apple-border)" }} muted playsInline />}
        {!camOn && shots.length === 0 && <DropZone accept="image/jpeg,image/png" multiple onFiles={addFiles} label="Select images or drop them here" sublabel="JPG or PNG. Each becomes a page." />}
        {shots.length > 0 && (
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {shots.map((s, i) => (
                <div key={i} className="card p-1 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s} alt={`Scan ${i + 1}`} className="w-full rounded" />
                  <button onClick={() => remove(i)} className="absolute top-1 right-1 w-6 h-6 rounded-full text-white text-xs" style={{ background: "rgba(0,0,0,0.6)" }}>✕</button>
                </div>
              ))}
            </div>
            {!camOn && <div className="mb-4"><DropZone accept="image/jpeg,image/png" multiple onFiles={addFiles} label="Add more images" sublabel="JPG or PNG" /></div>}
            {!resultUrl ? <button onClick={build} disabled={busy} className="btn-primary disabled:opacity-50">{busy ? "Building..." : `Create PDF (${shots.length} page${shots.length !== 1 ? "s" : ""})`}</button> :
              <div className="flex gap-3"><a href={resultUrl} download="scan.pdf" className="btn-primary">Download PDF</a><button onClick={() => { setShots([]); setResultUrl(null); }} className="btn-secondary">Start over</button></div>}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
