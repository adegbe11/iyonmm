import { ReactNode } from "react";
import Link from "next/link";

interface FAQ { q: string; a: string }

interface Props {
  title: string;
  subtitle: string;
  badge?: string;
  faqs: FAQ[];
  related?: { label: string; href: string }[];
  children: ReactNode;
}

// Lightweight wrapper for instant widgets and calculators (no file-upload framing).
export default function WidgetShell({ title, subtitle, badge, faqs, related, children }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {badge && (
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "#EDE7FB", color: "var(--apple-blue)" }}>
          {badge}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight" style={{ color: "var(--apple-black)" }}>{title}</h1>
      <p className="text-lg mb-8" style={{ color: "var(--apple-text-secondary)" }}>{subtitle}</p>

      <div className="mb-8">{children}</div>

      <div className="ad-slot mb-8">Advertisement</div>

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

      <div className="ad-slot">Advertisement</div>
    </div>
  );
}

// Shared JSON-LD helper for widget pages.
export function widgetJsonLd(name: string, slug: string, faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "SoftwareApplication", name, applicationCategory: "UtilitiesApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
      { "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://iyonm.com" }, { "@type": "ListItem", position: 2, name, item: `https://iyonm.com/${slug}` }] },
    ],
  };
}
