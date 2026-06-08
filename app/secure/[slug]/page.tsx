import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { securePages, getSecurePage } from "@/lib/secure-data";

const SITE = "https://www.iyonm.com";

export function generateStaticParams() {
  return securePages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getSecurePage(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.lead.slice(0, 155),
    alternates: { canonical: `${SITE}/secure/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getSecurePage(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "FAQPage", mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, { "@type": "ListItem", position: 2, name: p.h1, item: `${SITE}/secure/${slug}` }] },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "#EDE7FB", color: "var(--apple-blue)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
          Nothing uploaded
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{p.h1}</h1>
        <p className="text-lg mb-8" style={{ color: "var(--apple-text-secondary)" }}>{p.lead}</p>

        <div className="rounded-2xl p-5 mb-10 flex items-start gap-3" style={{ background: "#EDE7FB" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--apple-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
          <p className="text-sm"><strong>0 KB uploaded.</strong> Open your browser&apos;s Network tab while you use any IYONM tool and you will see zero data leave your device.</p>
        </div>

        {p.body.map((s, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{s.h}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--apple-text-secondary)" }}>{s.p}</p>
          </section>
        ))}

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Tools that run in your browser</h2>
          <div className="flex flex-wrap gap-2">
            {p.tools.map((t) => (
              <Link key={t.href} href={t.href} className="text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)" }}>{t.label}</Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6">FAQ</h2>
          <div className="space-y-4">
            {p.faqs.map((f, i) => (
              <details key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--apple-gray)" }}>
                <summary className="px-5 py-4 cursor-pointer font-medium text-sm">{f.q}</summary>
                <p className="px-5 pb-4 text-sm" style={{ color: "var(--apple-text-secondary)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="ad-slot">Advertisement</div>
      </div>
    </>
  );
}
