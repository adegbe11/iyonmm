import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { guides, getGuide } from "@/lib/seo-data";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: `${g.intro} Step by step guide, free, nothing uploaded.`,
    alternates: { canonical: `https://www.iyonm.com/how-to/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: g.title,
        description: g.intro,
        step: g.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
      },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.iyonm.com" }, { "@type": "ListItem", position: 2, name: g.title, item: `https://www.iyonm.com/how-to/${slug}` }] },
    ],
  };

  const otherGuides = guides.filter((x) => x.slug !== slug).slice(0, 5);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4" style={{ background: "#EDE7FB", color: "var(--apple-blue)" }}>
          Step by step guide
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{g.title}</h1>
        <p className="text-lg mb-8" style={{ color: "var(--apple-text-secondary)" }}>{g.intro}</p>

        <Link href={g.toolHref} className="btn-primary mb-10 inline-flex">Open the {g.toolLabel} tool</Link>

        <ol className="space-y-4 mb-10">
          {g.steps.map((s, i) => (
            <li key={i} className="flex gap-4 p-5 rounded-2xl" style={{ background: "var(--apple-gray)" }}>
              <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white" style={{ background: "var(--apple-blue)" }}>{i + 1}</span>
              <div>
                <p className="font-semibold mb-1">{s.name}</p>
                <p className="text-sm" style={{ color: "var(--apple-text-secondary)" }}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="p-5 rounded-2xl mb-10" style={{ background: "#EDE7FB" }}>
          <p className="text-sm"><strong>Tip:</strong> {g.tips}</p>
        </div>

        <div className="card p-6 text-center mb-10">
          <p className="font-semibold mb-1">Ready to try it?</p>
          <p className="text-sm mb-4" style={{ color: "var(--apple-text-secondary)" }}>Free, nothing uploaded, no signup.</p>
          <Link href={g.toolHref} className="btn-primary inline-flex">Open {g.toolLabel}</Link>
        </div>

        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--apple-text-secondary)" }}>More guides</h2>
        <div className="flex flex-wrap gap-2">
          {otherGuides.map((x) => (
            <Link key={x.slug} href={`/how-to/${x.slug}`} className="text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity" style={{ background: "var(--apple-gray)", color: "var(--apple-blue)" }}>
              {x.title.replace(" (Free, No Upload)", "").replace(" (Free)", "")}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
