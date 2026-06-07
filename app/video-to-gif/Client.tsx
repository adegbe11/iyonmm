"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import { loadFFmpeg } from "@/lib/ffmpeg";

function fmtSize(b: number) { return b < 1024 * 1024 ? (b / 1024).toFixed(1) + " KB" : (b / (1024 * 1024)).toFixed(2) + " MB"; }

export default function Client() {
  const [stage, setStage] = useState<"idle" | "working" | "done">("idle");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [fps, setFps] = useState(12);
  const [width, setWidth] = useState(480);
  const [start, setStart] = useState(0);
  const [dur, setDur] = useState(5);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [error, setError] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0]; if (!file) return;
    setError(""); setStage("working"); setProgress(0); setStatus("Loading engine (first run downloads ~30MB)...");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ff = await loadFFmpeg((r) => setProgress(Math.round(r * 100)));
      setStatus("Building your GIF...");
      const inName = "in." + (file.name.split(".").pop() || "mp4");
      await ff.writeFile(inName, await fetchFile(file));
      // Two-pass with palette for high-quality GIF
      const vf = `fps=${fps},scale=${width}:-1:flags=lanczos`;
      await ff.exec(["-ss", String(start), "-t", String(dur), "-i", inName, "-vf", `${vf},palettegen`, "palette.png"]);
      await ff.exec(["-ss", String(start), "-t", String(dur), "-i", inName, "-i", "palette.png", "-lavfi", `${vf} [x]; [x][1:v] paletteuse`, "out.gif"]);
      const data = await ff.readFile("out.gif");
      const blob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: "image/gif" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: file.name });
      setStage("done");
    } catch (e) {
      console.error(e);
      setError("Conversion failed. Try a shorter clip or a different video.");
      setStage("idle");
    }
  }

  return (
    <ToolShell
      title="Video to GIF"
      subtitle="Turn a video clip into a clean, high-quality GIF in your browser. No watermark, no signup, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "🎬", title: "Add your video", desc: "Drop in an MP4, MOV, or WebM file." },
        { icon: "⚙️", title: "Set the clip", desc: "Choose start, length, width, and frame rate." },
        { icon: "💾", title: "Download GIF", desc: "Save your watermark-free GIF." },
      ]}
      faqs={[
        { q: "Is there a watermark?", a: "No. The GIF is clean." },
        { q: "Are my videos uploaded?", a: "No. Conversion runs in your browser. Nothing leaves your device." },
        { q: "How do I keep the file small?", a: "Lower the width and FPS, and keep the clip short. GIFs grow fast with size and frame rate." },
        { q: "Why is the first run slow?", a: "It downloads the ~30MB engine once, then caches it." },
      ]}
      related={[{ label: "Compress Video", href: "/compress-video" }, { label: "Compress Image", href: "/compress-image" }]}
    >
      <div>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}
        {stage === "idle" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <label className="text-sm">Start (s)<input type="number" min={0} value={start} onChange={(e) => setStart(Math.max(0, +e.target.value))} className="w-full border rounded-lg px-2 py-1.5 mt-1" style={{ borderColor: "var(--apple-border)" }} /></label>
              <label className="text-sm">Length (s)<input type="number" min={1} max={30} value={dur} onChange={(e) => setDur(Math.min(30, Math.max(1, +e.target.value)))} className="w-full border rounded-lg px-2 py-1.5 mt-1" style={{ borderColor: "var(--apple-border)" }} /></label>
              <label className="text-sm">Width (px)<input type="number" min={120} max={1080} step={20} value={width} onChange={(e) => setWidth(+e.target.value)} className="w-full border rounded-lg px-2 py-1.5 mt-1" style={{ borderColor: "var(--apple-border)" }} /></label>
              <label className="text-sm">FPS<input type="number" min={5} max={30} value={fps} onChange={(e) => setFps(+e.target.value)} className="w-full border rounded-lg px-2 py-1.5 mt-1" style={{ borderColor: "var(--apple-border)" }} /></label>
            </div>
            <DropZone accept="video/*" onFiles={handleFile} label="Select video or drop video here" sublabel="MP4, MOV, WebM. No watermark." />
          </>
        )}
        {stage === "working" && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium mb-3">{status} {progress > 0 && progress < 100 ? `${progress}%` : ""}</p>
            {progress > 0 && <div className="progress-bar max-w-xs mx-auto"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>}
          </div>
        )}
        {stage === "done" && result && (
          <div className="card p-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="GIF result" className="max-h-64 mx-auto rounded-xl mb-4" />
            <p className="font-bold text-lg mb-3">GIF ready · {fmtSize(result.size)}</p>
            <div className="flex gap-3 justify-center">
              <a href={result.url} download={result.name.replace(/\.[^.]+$/, "") + ".gif"} className="btn-primary">Download GIF</a>
              <button onClick={() => { setStage("idle"); setResult(null); }} className="btn-secondary">Make another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
