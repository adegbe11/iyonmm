import Link from "next/link";

export default function PrivacyBanner() {
  return (
    <>
      {/* Bold compliance banner */}
      <section className="relative overflow-hidden" style={{ background: "var(--apple-blue)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-5" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              🔒 Built for legal, medical & corporate teams
            </span>
            <h2 className="font-bold text-white tracking-tight mb-4" style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", lineHeight: 1.05 }}>
              Stop uploading corporate documents to remote servers.
            </h2>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              iLovePDF processes your data on their servers. IYONM fixes, merges, and converts documents <strong>100% inside your browser</strong>. Zero data leaves your computer.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#prove-it" className="inline-flex items-center font-semibold px-6 py-3 rounded-xl transition-transform hover:-translate-y-0.5" style={{ background: "white", color: "var(--apple-blue)" }}>
                Prove it to yourself
              </a>
              <Link href="/ilovepdf-alternative" className="inline-flex items-center font-semibold px-6 py-3 rounded-xl transition-colors" style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
                IYONM vs iLovePDF
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative shapes (the IYONM download motif), faint, right side */}
        <div className="hidden md:block absolute top-0 right-0 h-full w-1/2 pointer-events-none">
          <div className="absolute" style={{ top: "-10%", right: "8%", width: 240, height: 240, borderRadius: 48, background: "rgba(0,0,0,0.12)", transform: "rotate(18deg)" }} />
          <div className="absolute" style={{ bottom: "-15%", right: "26%", width: 300, height: 300, borderRadius: 60, background: "rgba(0,0,0,0.10)", transform: "rotate(18deg)" }} />
          <svg className="absolute" style={{ top: "28%", right: "14%", opacity: 0.18 }} width="180" height="180" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v14M6 11l6 6 6-6" /><path d="M4 21h16" /></svg>
        </div>
      </section>

      {/* Interactive "prove it" verification */}
      <section id="prove-it" className="scroll-mt-16" style={{ background: "#12141c", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: steps */}
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(103,61,230,0.18)", color: "#a98cff" }}>
              🕵️ Prove it to yourself
            </span>
            <h3 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Don&apos;t trust our policy. Trust your own browser.</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              You never have to blindly trust a privacy policy again. Audit IYONM right now with the developer tools already built into your browser.
            </p>
            <ul className="space-y-4 text-sm text-white/85">
              {[
                <>Press <kbd className="px-1.5 py-0.5 rounded text-white text-xs font-mono" style={{ background: "rgba(255,255,255,0.1)" }}>F12</kbd> (or right-click and choose <b>Inspect</b>) to open Developer Tools.</>,
                <>Click the <b style={{ color: "#a98cff" }}>Network</b> tab at the top of the panel.</>,
                <>Drop a file into any tool. Watch exactly <b className="text-emerald-400">0 KB</b> transfer over the internet.</>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white font-mono text-xs" style={{ background: "rgba(255,255,255,0.1)" }}>{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: simulated DevTools network panel */}
          <div className="rounded-xl p-5 sm:p-6 font-mono text-xs text-white/70 shadow-2xl relative overflow-hidden" style={{ background: "#090b11", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center justify-between border-b pb-3 mb-4 text-white/40" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="flex items-center gap-4">
                <span>Elements</span><span>Console</span>
                <span className="text-white font-semibold pb-3 -mb-3.5" style={{ borderBottom: "2px solid var(--apple-blue)" }}>Network</span>
                <span className="hidden sm:inline">Sources</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#34d399" }} /> Local Execution Active
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="grid grid-cols-4 text-white/30 font-semibold border-b pb-1 text-[11px]" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span>Name</span><span>Status</span><span>Type</span><span className="text-right">Transferred</span>
              </div>
              <div className="grid grid-cols-4 text-white/90"><span style={{ color: "#a98cff" }}>wasm_engine.js</span><span className="text-emerald-400">200 OK</span><span>script</span><span className="text-right text-white/40">Cached</span></div>
              <div className="grid grid-cols-4 text-white/90"><span style={{ color: "#a98cff" }}>pdf_core.wasm</span><span className="text-emerald-400">200 OK</span><span>wasm</span><span className="text-right text-white/40">Cached</span></div>
              <div className="grid grid-cols-4 rounded p-1 -mx-1 text-emerald-400 font-semibold animate-pulse" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}><span>your_private_file.pdf</span><span>LOCAL</span><span>document</span><span className="text-right">0 KB</span></div>
            </div>
            <div className="border-t mt-6 pt-3 flex items-center justify-between text-[11px] text-white/40" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              <div>4 requests · 120 KB cached · 140 ms</div>
              <div className="text-emerald-400 font-bold">Uploaded: 0 Bytes</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
