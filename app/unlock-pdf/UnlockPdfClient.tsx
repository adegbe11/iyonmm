"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";

export default function UnlockPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function unlock() {
    setError("");
    if (!file) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buf = await file.arrayBuffer();
      let doc;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        doc = await PDFDocument.load(buf, { password, ignoreEncryption: false } as any);
      } catch {
        setError("Incorrect password or the PDF uses unsupported encryption.");
        setProcessing(false);
        return;
      }
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      setResultUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("Failed to process PDF. It may use unsupported encryption.");
      console.error(e);
    }
    setProcessing(false);
  }

  return (
    <ToolShell
      title="Unlock PDF"
      subtitle="Remove the password from a PDF you own. Enter the correct password and download an unrestricted copy. Nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload PDF", desc: "Select the password-protected PDF." },
        { icon: "🔑", title: "Enter password", desc: "Type in the current PDF password." },
        { icon: "🔓", title: "Download", desc: "Get an unlocked copy of your PDF." },
      ]}
      faqs={[
        { q: "Do I need the original password?", a: "Yes. This tool removes protection from PDFs you own, you must know the current password." },
        { q: "Are my files uploaded?", a: "No. Unlocking runs entirely in your browser. Nothing is sent to any server." },
        { q: "What encryption types are supported?", a: "Standard PDF password encryption (40-bit and 128-bit RC4). AES-256 encryption requires the correct password." },
        { q: "Is this legal?", a: "Unlocking a PDF you own is legal. Do not use this tool on PDFs you do not have rights to." },
      ]}
      related={[
        { label: "Protect PDF", href: "/protect-pdf" },
        { label: "Compress PDF", href: "/compress-pdf" },
        { label: "Merge PDF", href: "/merge-pdf" },
      ]}
    >
      <div className="space-y-4">
        {!file ? (
          <DropZone accept="application/pdf,.pdf" onFiles={(f) => { setFile(f[0]); setResultUrl(null); setError(""); }} label="Select PDF file or drop PDF here" sublabel="Any size works" />
        ) : (
          <>
            <div className="card p-4 flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <p className="flex-1 text-sm font-medium">{file.name}</p>
              <button onClick={() => { setFile(null); setResultUrl(null); setError(""); }} className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>Remove</button>
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter current PDF password"
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#673DE6]"
              style={{ borderColor: "var(--apple-border)" }}
              onKeyDown={(e) => e.key === "Enter" && unlock()}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}

            {!resultUrl ? (
              <button onClick={unlock} disabled={processing || !password} className="btn-primary disabled:opacity-50">
                {processing ? "Unlocking..." : "Unlock PDF"}
              </button>
            ) : (
              <div className="card p-5 text-center">
                <p className="font-semibold mb-3">🔓 Password removed</p>
                <div className="flex gap-3 justify-center">
                  <a href={resultUrl} download={file.name.replace(".pdf", "") + "-unlocked.pdf"} className="btn-primary">Download unlocked PDF</a>
                  <button onClick={() => { setResultUrl(null); setPassword(""); }} className="btn-secondary">Unlock another</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolShell>
  );
}
