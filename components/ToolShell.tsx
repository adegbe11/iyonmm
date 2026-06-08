"use client";
import { ReactNode } from "react";
import Link from "next/link";

interface Step { icon: string; title: string; desc: string }
interface FAQ { q: string; a: string }

interface Props {
  title: string;
  subtitle: string;
  steps: Step[];
  faqs: FAQ[];
  badge?: string;
  related?: { label: string; href: string }[];
  children: ReactNode;
}

export default function ToolShell({ title, subtitle, steps, faqs, badge, related, children }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {badge && (
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "#EDE7FB", color: "var(--apple-blue)" }}>
          {badge}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight" style={{ color: "var(--apple-black)" }}>{title}</h1>
      <p className="text-lg mb-8" style={{ color: "var(--apple-text-secondary)" }}>{subtitle}</p>

      {/* Tool area */}
      <div className="mb-8">{children}</div>

      {/* Privacy proof + comparison (appears on every tool) */}
      <PrivacyProof />

      {/* Ad slot above result */}
      <div className="ad-slot mb-8">Advertisement</div>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6">How to use</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div key={i} className="p-5 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <div className="text-2xl mb-2">{step.icon}</div>
              <p className="font-semibold text-sm mb-1">{i + 1}. {step.title}</p>
              <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-6">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--apple-gray)" }}>
              <summary className="px-5 py-4 cursor-pointer font-medium text-sm">{faq.q}</summary>
              <p className="px-5 pb-4 text-sm" style={{ color: "var(--apple-text-secondary)" }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related && related.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--apple-text-secondary)" }}>Related tools</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)" }}>
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer ad */}
      <div className="ad-slot">Advertisement</div>
    </div>
  );
}

function PrivacyProof() {
  return (
    <section className="mb-8 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--apple-border)" }}>
      <div className="flex items-center gap-3 px-5 py-4" style={{ background: "#EDE7FB" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--apple-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--apple-black)" }}>0 KB uploaded. Your file never leaves this browser tab.</p>
          <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>Open your browser&apos;s Network tab while you use this tool, you will see zero data sent to any server.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 text-xs" style={{ background: "white" }}>
        <div className="p-3 font-semibold" style={{ color: "var(--apple-text-secondary)" }}> </div>
        <div className="p-3 text-center font-semibold" style={{ color: "var(--apple-blue)" }}>IYONM</div>
        <div className="p-3 text-center font-semibold" style={{ color: "var(--apple-text-secondary)" }}>Cloud tools</div>
        {[
          ["Your files", "Stay on your device", "Uploaded to a server"],
          ["File size limit", "None", "Capped on free plans"],
          ["Works offline", "Yes", "No"],
          ["Signup", "Never", "Pushed for limits"],
        ].map((row, i) => (
          <div key={i} className="contents">
            <div className="p-3 border-t font-medium" style={{ borderColor: "var(--apple-border)" }}>{row[0]}</div>
            <div className="p-3 border-t text-center flex items-center justify-center gap-1" style={{ borderColor: "var(--apple-border)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>{row[1]}
            </div>
            <div className="p-3 border-t text-center" style={{ borderColor: "var(--apple-border)", color: "var(--apple-text-secondary)" }}>{row[2]}</div>
          </div>
        ))}
      </div>
      <Link href="/ilovepdf-alternative" className="block px-5 py-3 text-xs font-medium hover:underline" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)" }}>
        See the full IYONM vs iLovePDF comparison →
      </Link>
    </section>
  );
}
