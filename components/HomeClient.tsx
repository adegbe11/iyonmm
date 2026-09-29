"use client";
import { useState, type CSSProperties } from "react";
import "./home.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tools, categories, Category } from "@/lib/tools";
import HomeResources from "@/components/HomeResources";
import ToolIcon from "@/components/ToolIcon";
import RotatingWord from "@/components/RotatingWord";
import DocumentRenamerSpotlight from "@/components/DocumentRenamerSpotlight";
import SmartDropzone from "@/components/SmartDropzone";
import WorkYourWay from "@/components/WorkYourWay";

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
    <div className="restored-home">
      {/* Hero */}
      <section className="original-hero text-center px-4" style={{ background: "var(--apple-gray)" }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-title font-bold tracking-tight" aria-label="Free online PDF, image and video tools">
            <span aria-hidden="true">
              Free Online <RotatingWord words={["PDF", "Image", "Video"]} /> Tools
            </span>
          </h1>
          <p className="hero-description mx-auto">
            Merge PDFs, compress videos, and convert images with IYONM.
            <br className="hidden sm:block" /> Free tools, without uploading your files.
          </p>

          {/* Tool search */}
          <form onSubmit={onSearch} className="hero-search relative max-w-xl mx-auto text-left">
            <div className="flex items-center gap-2 bg-white rounded-2xl p-2 pl-4" style={{ border: "1px solid var(--apple-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--apple-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
              <input aria-label="Search tools" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type the tool you want" className="flex-1 min-w-0 bg-transparent outline-none text-base py-2" style={{ color: "var(--apple-black)" }} />
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
          <SmartDropzone compact />
        </div>
      </section>

      {/* Filter pills + grid */}
      <section id="tools" className="tool-catalog px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="catalog-filters flex flex-wrap justify-center gap-2 mb-8 sm:mb-10">
            {categories.map((c) => (
              <button
                key={c.key}
                aria-pressed={active === c.key}
                onClick={() => setActive(c.key)}
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all"
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

          <div className="thick-tool-grid grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((tool) => (
              <Link key={tool.href} href={tool.href} className="thick-tool-card group" style={{ "--tile-accent": tool.color } as CSSProperties}>
                <div className="thick-card-top"><span className="thick-card-icon"><ToolIcon icon={tool.icon} color={tool.color} size={52} /></span><span className="thick-card-arrow" aria-hidden="true">↗</span></div>
                <p className="thick-card-title">{tool.label}</p>
                <p className="thick-card-description">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WorkYourWay />

      <DocumentRenamerSpotlight />

      <HomeResources />
    </div>
  );
}
