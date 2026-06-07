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
