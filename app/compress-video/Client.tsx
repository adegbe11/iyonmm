"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import { loadFFmpeg } from "@/lib/ffmpeg";

function fmtSize(b: number) { return b < 1024 * 1024 ? (b / 1024).toFixed(1) + " KB" : (b / (1024 * 1024)).toFixed(2) + " MB"; }

const QUALITY = { Low: 33, Medium: 28, High: 23 } as const;

export default function Client() {
  const [stage, setStage] = useState<"idle" | "working" | "done">("idle");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState<keyof typeof QUALITY>("Medium");
  const [result, setResult] = useState<{ url: string; size: number; original: number; name: string } | null>(null);
  const [error, setError] = useState("");

  async function handleFile(files: File[]) {
    const file = files[0]; if (!file) return;
    setError(""); setStage("working"); setProgress(0); setStatus("Loading video engine (first run downloads ~30MB)...");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const ff = await loadFFmpeg((r) => setProgress(Math.round(r * 100)));
      setStatus("Compressing...");
      const inName = "in." + (file.name.split(".").pop() || "mp4");
      await ff.writeFile(inName, await fetchFile(file));
      await ff.exec(["-i", inName, "-vcodec", "libx264", "-crf", String(QUALITY[quality]), "-preset", "veryfast", "-acodec", "aac", "-b:a", "128k", "out.mp4"]);
      const data = await ff.readFile("out.mp4");
      const blob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: "video/mp4" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, original: file.size, name: file.name });
      setStage("done");
    } catch (e) {
      console.error(e);
      setError("Compression failed. Try a smaller video or a different format (MP4, MOV, WebM).");
      setStage("idle");
    }
  }

  const saving = result ? Math.round((1 - result.size / result.original) * 100) : 0;

  return (
    <ToolShell
      title="Compress Video"
      subtitle="Shrink MP4, MOV, and WebM videos right in your browser. No watermark, no signup, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "🎬", title: "Add your video", desc: "Drop in an MP4, MOV, or WebM file." },
        { icon: "🎚️", title: "Pick quality", desc: "Choose the balance of size versus quality." },
        { icon: "💾", title: "Download", desc: "Save the compressed video, watermark-free." },
      ]}
      faqs={[
        { q: "Are my videos uploaded?", a: "No. Compression runs in your browser with ffmpeg.wasm. Your video never leaves your device." },
        { q: "Is there a watermark?", a: "No watermark, ever." },
        { q: "Why is the first run slow?", a: "It downloads the ~30MB video engine once, then caches it. Large videos still take time because all the work happens on your device." },
        { q: "What formats are supported?", a: "MP4, MOV, WebM, and most common video formats. Output is MP4 (H.264)." },
      ]}
      related={[{ label: "Video to GIF", href: "/video-to-gif" }, { label: "Compress Image", href: "/compress-image" }]}
    >
      <div>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}
        {stage === "idle" && (
          <>
            <div className="mb-4 flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <span className="text-sm font-medium">Quality</span>
              {(Object.keys(QUALITY) as (keyof typeof QUALITY)[]).map((q) => (
                <button key={q} onClick={() => setQuality(q)} className={`px-4 py-1.5 rounded-full text-sm border ${quality === q ? "border-[#673DE6] text-[#673DE6] bg-[#EDE7FB]" : "border-[#D2D2D7]"}`}>{q}</button>
              ))}
            </div>
            <DropZone accept="video/*" onFiles={handleFile} label="Select video or drop video here" sublabel="MP4, MOV, WebM. Processed on your device, no watermark." />
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
            <video src={result.url} controls className="max-h-64 mx-auto rounded-xl mb-4" />
            <p className="font-bold text-lg mb-1">{fmtSize(result.original)} → {fmtSize(result.size)} {saving > 0 && <span style={{ color: "#34C759" }}>(-{saving}%)</span>}</p>
            <div className="flex gap-3 justify-center mt-3">
              <a href={result.url} download={result.name.replace(/\.[^.]+$/, "") + "-compressed.mp4"} className="btn-primary">Download MP4</a>
              <button onClick={() => { setStage("idle"); setResult(null); }} className="btn-secondary">Compress another</button>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
