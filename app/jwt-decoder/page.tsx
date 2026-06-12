import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "JWT Decoder Online Free, Decode JSON Web Tokens",
  description: "Decode a JWT to read its header and payload. Private and free, runs entirely in your browser. Your token never leaves your device.",
  alternates: { canonical: "https://www.iyonm.com/jwt-decoder" },
};

const faqs = [
  { q: "Does it verify the signature?", a: "No. This tool decodes the header and payload so you can read them. It does not validate the signature, so never trust an unverified token in production." },
  { q: "Is my token uploaded?", a: "No. Decoding happens entirely in your browser. Your token never leaves your device, which matters for secrets." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("JWT Decoder", "jwt-decoder", faqs)) }} /><Client /></>);
}
