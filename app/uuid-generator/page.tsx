import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "UUID Generator Online Free, Bulk UUID v4",
  description: "Generate secure UUID v4 identifiers in bulk. Free, private, runs entirely in your browser. Copy one or all.",
  alternates: { canonical: "https://www.iyonm.com/uuid-generator" },
};

const faqs = [
  { q: "What version of UUID is this?", a: "UUID v4 (random), generated with the browser's cryptographically secure crypto.randomUUID()." },
  { q: "Are they unique?", a: "Yes. v4 UUIDs are random with negligible collision probability, suitable for IDs and keys." },
  { q: "Is anything sent to a server?", a: "No. UUIDs are generated on your device. Nothing is uploaded." },
];

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("UUID Generator", "uuid-generator", faqs)) }} /><Client /></>);
}
