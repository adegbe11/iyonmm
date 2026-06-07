"use client";
import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import DropZone from "@/components/DropZone";
import { scanDocument, type ScanResult } from "@/lib/clause-scanner";

const sevColor: Record<string, string> = { high: "#FF3B30", medium: "#FF9500", low: "#FFCC00" };
const catLabel: Record<string, string> = {
  predatory_clause: "Predatory clause",
  missing_protection: "Missing protection",
  data_privacy: "Data privacy",
  fairness_clarity: "Fairness & clarity",
};

export default function LegalAuditorClient() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);

  async function handleFile(files: File[]) {
    const file = files[0];
    if (!file) return;
    setError("");
    setWorking(true);
    try {
      let text = "";
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
        const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          text += content.items.map((it: any) => it.str).join(" ") + "\n";
        }
      } else {
        text = await file.text();
      }
      if (!text.trim()) {
        setError("No readable text found. If this is a scanned PDF, run OCR PDF first.");
        setWorking(false);
        return;
      }
      setResult(scanDocument(text));
    } catch (e) {
      console.error(e);
      setError("Could not read that file. Use a text-based PDF or a .txt file.");
    }
    setWorking(false);
  }

  return (
    <ToolShell
      title="Contract Risk Scanner"
      subtitle="Scan a contract or policy for common red flags: predatory clauses, missing protections, and GDPR / HIPAA gaps. Runs entirely in your browser, nothing uploaded."
      badge="100% Client-side"
      steps={[
        { icon: "📄", title: "Upload the document", desc: "Text is read in your browser from a PDF or text file." },
        { icon: "🔍", title: "Scan locally", desc: "A built-in rules engine checks for known risky clause patterns." },
        { icon: "✅", title: "Review findings", desc: "Each flag comes with the risk, the regulation, and a suggested fix." },
      ]}
      faqs={[
        { q: "Is this legal advice?", a: "No. It is an automated red-flag scan to help you spot common issues fast. For binding decisions, consult a qualified attorney." },
        { q: "How does it work without uploading my file?", a: "The whole scan runs in your browser using a built-in pattern library. Your document never leaves your device, and no AI service or API key is involved." },
        { q: "How smart is it?", a: "It detects common problem clauses and missing protections by language patterns. It does not reason about full context the way a lawyer would, so treat it as a fast first pass, not a full review." },
        { q: "What file types work?", a: "Text-based PDFs and plain text files. For scanned PDFs, run OCR PDF first to get a text layer." },
      ]}
      related={[
        { label: "OCR PDF", href: "/ocr-pdf" },
        { label: "Fill PDF Forms", href: "/pdf-to-form" },
        { label: "Protect PDF", href: "/protect-pdf" },
      ]}
    >
      <div>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#FFF0F0", color: "#FF3B30" }}>{error}</div>}

        {!result && !working && (
          <DropZone accept="application/pdf,.pdf,.txt,text/plain" onFiles={handleFile} label="Select document or drop it here" sublabel="Text-based PDF or .txt file. Nothing leaves your device." />
        )}

        {working && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 rounded-full border-[#673DE6] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium">Scanning your document...</p>
          </div>
        )}

        {result && (
          <div>
            <div className="card p-5 mb-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: "var(--apple-text-secondary)" }}>{result.documentType}</p>
                  <p className="font-bold text-lg">Overall risk: <span style={{ color: sevColor[result.overallRisk] }}>{result.overallRisk.toUpperCase()}</span></p>
                </div>
                <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: "var(--apple-gray)" }}>{result.findings.length} flag{result.findings.length !== 1 ? "s" : ""}</span>
              </div>
              <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>{result.summary}</p>
            </div>

            <div className="space-y-3">
              {result.findings.map((f, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: sevColor[f.severity] }}>{f.severity.toUpperCase()}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--apple-gray)", color: "var(--apple-text-secondary)" }}>{catLabel[f.category] || f.category}</span>
                    <p className="font-semibold text-sm">{f.title}</p>
                  </div>
                  <blockquote className="text-sm italic border-l-2 pl-3 my-2" style={{ borderColor: "var(--apple-border)", color: "var(--apple-text-secondary)" }}>{f.quote}</blockquote>
                  <p className="text-sm mb-2">{f.risk}</p>
                  <p className="text-xs mb-2" style={{ color: "var(--apple-text-secondary)" }}><strong>Relates to:</strong> {f.regulation}</p>
                  <div className="p-3 rounded-lg text-sm" style={{ background: "#EBF9EE" }}><strong>Suggested fix:</strong> {f.recommendation}</div>
                </div>
              ))}
              {result.findings.length === 0 && (
                <div className="card p-6 text-center"><p className="text-2xl mb-2">✅</p><p className="font-semibold">No common red flags detected</p><p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>The usual problem clauses were not found. This does not guarantee the document is safe.</p></div>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={() => { setResult(null); setError(""); }} className="btn-secondary">Scan another document</button>
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--apple-text-secondary)" }}>This scan is informational and not a substitute for advice from a qualified attorney.</p>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
