import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { converters, getConverter } from "@/lib/converters";
import ConverterClient from "./ConverterClient";

export function generateStaticParams() {
  return converters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getConverter(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `https://www.iyonm.com/convert/${slug}` },
  };
}

export default async function ConverterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getConverter(slug);
  if (!c) notFound();
  return <ConverterClient config={c} />;
}
