"use client";
import { useState, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { setPendingFiles, detectCategory } from "@/lib/handoff";
import ToolIcon from "@/components/ToolIcon";

type Cat = ReturnType<typeof detectCategory>;

const SUGGESTIONS: Record<Exclude<Cat, "unknown">, { label: string; href: string; icon: string; color: string }[]> = {
  pdf: [
    { label: "Compress PDF", href: "/compress-pdf", icon: "compress", color: "#34C759" },
    { label: "Merge PDF", href: "/merge-pdf", icon: "merge", color: "#FF5B47" },
    { label: "Split PDF", href: "/split-pdf", icon: "split", color: "#FF5B47" },
    { label: "PDF to Word", href: "/pdf-to-word", icon: "word", color: "#2B7BF3" },
    { label: "PDF to JPG", href: "/pdf-to-jpg", icon: "pdf2img", color: "#FFB22C" },
    { label: "Edit PDF", href: "/edit-pdf", icon: "pagenum", color: "#A855F7" },
    { label: "Sign PDF", href: "/sign-pdf", icon: "watermark", color: "#A855F7" },
    { label: "Compress to size", href: "/compress-pdf-to/200kb", icon: "compress", color: "#34C759" },
  ],
  image: [
    { label: "Compress Image", href: "/compress-image", icon: "compressimg", color: "#FF2D92" },
    { label: "Resize Image", href: "/resize-image", icon: "resize", color: "#FF2D92" },
    { label: "Remove Background", href: "/remove-background", icon: "magic", color: "#FF2D92" },
    { label: "AI Upscaler", href: "/image-upscaler", icon: "magic", color: "#FF2D92" },
    { label: "Convert to JPG", href: "/convert/png-to-jpg", icon: "convertimg", color: "#FF2D92" },
    { label: "Image to PDF", href: "/image-to-pdf", icon: "img2pdf", color: "#FFB22C" },
  ],
  video: [
    { label: "Compress Video", href: "/compress-video", icon: "compress", color: "#FF2D92" },
    { label: "Video to GIF", href: "/video-to-gif", icon: "convertimg", color: "#FF2D92" },
  ],
  word: [
    { label: "Word to PDF", href: "/word-to-pdf", icon: "word", color: "#2B7BF3" },
  ],
  excel: [
    { label: "Excel to PDF", href: "/excel-to-pdf", icon: "excel", color: "#21A366" },
  ],
};

const CAT_LABEL: Record<Cat, string> = { pdf: "PDF", image: "Image", video: "Video", word: "Word document", excel: "Spreadsheet", unknown: "file" };

export default function SmartDropzone() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cat, setCat] = useState<Cat>("unknown");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const c = detectCategory(f);
    setFile(f); setCat(c);
    if (c !== "unknown") setPendingFiles([f]);
  }
  function onDrop(e: DragEvent) { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }

  const tools = cat !== "unknown" ? SUGGESTIONS[cat] : [];

  return (
    <div className="max-w-2xl mx-auto mb-6">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="rounded-3xl cursor-pointer transition-all text-center px-6 py-10"
          style={{
            border: `2px dashed ${dragging ? "var(--apple-blue)" : "rgba(103,61,230,0.35)"}`,
            background: dragging ? "#EDE7FB" : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <input ref={inputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: "var(--apple-blue)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>
          </div>
          <p className="font-semibold text-lg" style={{ color: "var(--apple-black)" }}>Drop any PDF, image, or video here</p>
          <p className="text-sm mt-1" style={{ color: "var(--apple-text-secondary)" }}>We detect the file and show you the right tool. Nothing is uploaded.</p>
        </div>
      ) : (
        <div className="rounded-3xl p-6 text-left" style={{ border: "1px solid var(--apple-border)", background: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{cat === "image" ? "🖼️" : cat === "video" ? "🎬" : cat === "pdf" ? "📄" : "📁"}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{file.name}</p>
              <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>Detected: {CAT_LABEL[cat]} · pick a tool below</p>
            </div>
            <button onClick={() => { setFile(null); setCat("unknown"); }} className="ml-auto text-sm flex-shrink-0" style={{ color: "var(--apple-text-secondary)" }}>Change</button>
          </div>
          {tools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tools.map((t) => (
                <button key={t.href} onClick={() => router.push(t.href)} className="flex items-center gap-2.5 p-2.5 rounded-xl text-left hover:bg-[#F5F5F7] transition-colors" style={{ border: "1px solid var(--apple-border)" }}>
                  <ToolIcon icon={t.icon} color={t.color} size={28} />
                  <span className="text-sm font-medium" style={{ color: "var(--apple-black)" }}>{t.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>We could not match that file type. Try the search below to find a tool.</p>
          )}
        </div>
      )}
    </div>
  );
}
