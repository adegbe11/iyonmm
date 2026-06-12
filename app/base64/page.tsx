import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Base64 Encode and Decode Online Free",
  description: "Encode text to Base64 or decode Base64 to text instantly. Free, private, runs entirely in your browser. Handles full Unicode.",
  alternates: { canonical: "https://iyonm.com/base64" },
};

const faqs = [
  { q: "Is my data uploaded?", a: "No. Encoding and decoding run entirely in your browser. Nothing is sent anywhere." },
  { q: "Does it handle Unicode?", a: "Yes. UTF-8 text with emojis and accents encodes and decodes correctly." },
  { q: "Is it free?", a: "Yes, free with no limits and no signup." },
];

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Base64 Encode / Decode", "base64", faqs)) }} /><Client /></>);
}
