"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tools, categories, Category } from "@/lib/tools";
import { compressTargets, resizePresets, compressPdfTargets, passportSpecs, guides } from "@/lib/seo-data";
import ToolIcon from "@/components/ToolIcon";
import RotatingWord from "@/components/RotatingWord";
import ToolsInAction from "@/components/ToolsInAction";

export default function HomeClient() {
  const router = useRouter();
  const [active, setActive] = useState<Category | "all">("all");
  const filtered = active === "all" ? tools : tools.filter((t) => t.categories.includes(active));

  const [q, setQ] = useState("");
  const matches = q.trim()
    ? tools.filter((t) => t.label.toLowerCase().includes(q.toLowerCase()) || t.desc.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];
  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (matches[0]) router.push(matches[0].href);
  }

  return (
    <>
      {/* Hero */}
      <section className="text-center px-4 pt-20 pb-12" style={{ background: "var(--apple-gray)" }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold tracking-tight mb-5" style={{ color: "var(--apple-black)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05 }} aria-label="Free online PDF, image and video tools. No sign up, no payment.">
            <span aria-hidden="true">
              Free Online <RotatingWord words={["PDF", "Image", "Video", "JSON", "QR Code"]} /> Tools<br />
              <span style={{ color: "var(--apple-blue)" }}>No sign up. No payment.</span>
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl" style={{ color: "var(--apple-text-secondary)", fontSize: "clamp(1.05rem, 2.5vw, 1.35rem)" }}>
            Stop jumping between tabs. Instantly audit contracts, compress videos, merge PDFs, format JSON, and upscale images in one click. 100% free, completely secure, and built right into your browser.
          </p>

          {/* Tool search */}
          <form onSubmit={onSearch} className="relative max-w-xl mx-auto mb-8 text-left">
            <div className="flex items-center gap-2 bg-white rounded-2xl p-2 pl-4" style={{ border: "1px solid var(--apple-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type the tool you want" className="flex-1 min-w-0 bg-transparent outline-none text-base py-2" style={{ color: "var(--apple-black)" }} />
              <button type="submit" className="btn-primary flex-shrink-0" style={{ borderRadius: 12, padding: "10px 24px" }}>Search</button>
            </div>
            {matches.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-2 rounded-2xl p-2" style={{ background: "white", border: "1px solid var(--apple-border)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>
                {matches.map((t) => (
                  <Link key={t.href} href={t.href} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F5F7] transition-colors">
                    <ToolIcon icon={t.icon} color={t.color} size={30} />
                    <span className="text-sm font-medium" style={{ color: "var(--apple-black)" }}>{t.label}</span>
                    <span className="text-xs ml-auto truncate hidden sm:block" style={{ color: "var(--apple-text-secondary)" }}>{t.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Filter pills + grid */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={
                  active === c.key
                    ? { background: "var(--apple-black)", color: "white" }
                    : { background: "white", color: "var(--apple-black)", border: "1px solid var(--apple-border)" }
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool) => (
              <Link key={tool.href} href={tool.href} className="card p-5 hover:shadow-lg transition-shadow group">
                <ToolIcon icon={tool.icon} color={tool.color} />
                <p className="font-semibold text-base mt-4 mb-1 group-hover:text-[#673DE6] transition-colors">{tool.label}</p>
                <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ToolsInAction />

      {/* Compress by exact size */}
      <section className="px-4 py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Compress image to an exact size</h2>
          <p className="text-sm mb-6" style={{ color: "var(--apple-text-secondary)" }}>Hit the exact file size forms and uploads ask for. We do the math for you.</p>
          <div className="flex flex-wrap gap-3">
            {compressTargets.map((t) => (
              <Link key={t.slug} href={`/compress-image-to/${t.slug}`} className="px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)", border: "1px solid var(--apple-border)" }}>
                Compress to {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Compress PDF by exact size */}
      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Compress PDF to an exact size</h2>
          <p className="text-sm mb-6" style={{ color: "var(--apple-text-secondary)" }}>Get your PDF under the email or upload limit in one click.</p>
          <div className="flex flex-wrap gap-3">
            {compressPdfTargets.map((t) => (
              <Link key={t.slug} href={`/compress-pdf-to/${t.slug}`} className="px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)", border: "1px solid var(--apple-border)" }}>
                PDF to {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Resize for platforms */}
      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Resize for any platform</h2>
          <p className="text-sm mb-6" style={{ color: "var(--apple-text-secondary)" }}>The exact pixel size for every social network and screen, one click away.</p>
          <div className="flex flex-wrap gap-3">
            {resizePresets.map((p) => (
              <Link key={p.slug} href={`/resize-image-for/${p.slug}`} className="px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)", border: "1px solid var(--apple-border)" }}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Passport photos */}
      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Passport & visa photos</h2>
          <p className="text-sm mb-6" style={{ color: "var(--apple-text-secondary)" }}>Crop your photo to the official size for any country.</p>
          <div className="flex flex-wrap gap-3">
            {passportSpecs.slice(0, 12).map((p) => (
              <Link key={p.slug} href={`/passport-photo/${p.slug}`} className="px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)", border: "1px solid var(--apple-border)" }}>
                {p.country}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">How-to guides</h2>
          <p className="text-sm mb-6" style={{ color: "var(--apple-text-secondary)" }}>Quick step by step walkthroughs for the most common tasks.</p>
          <div className="flex flex-wrap gap-3">
            {guides.map((g) => (
              <Link key={g.slug} href={`/how-to/${g.slug}`} className="px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)", border: "1px solid var(--apple-border)" }}>
                {g.title.replace(" (Free, No Upload)", "").replace(" (Free)", "")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy banner */}
      <section className="px-4 py-16" style={{ background: "var(--apple-gray)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: "white", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#673DE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Your files never touch our servers</h2>
          <p className="max-w-2xl mx-auto mb-8" style={{ color: "var(--apple-text-secondary)" }}>
            Unlike other PDF sites, IyonM processes everything locally in your browser. Your documents stay on your device, always. That is faster, and it is private by design.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: "🔒", title: "100% Private", desc: "Zero uploads. Your data stays yours." },
              { icon: "♾️", title: "No Limits", desc: "No size caps, no task limits, no signup." },
              { icon: "⚡", title: "Instant", desc: "Processing starts the moment you drop a file." },
            ].map((b) => (
              <div key={b.title} className="p-6 rounded-2xl text-center" style={{ background: "white" }}>
                <div className="text-3xl mb-2">{b.icon}</div>
                <h3 className="font-semibold mb-1">{b.title}</h3>
                <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
