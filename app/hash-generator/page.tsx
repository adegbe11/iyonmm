import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Hash Generator Online Free, SHA-256, SHA-512 & More",
  description: "Generate SHA-256, SHA-1, SHA-384, and SHA-512 hashes of any text. Free, private, runs entirely in your browser with Web Crypto.",
  alternates: { canonical: "https://iyonm.com/hash-generator" },
};

const faqs = [
  { q: "Which algorithms are supported?", a: "SHA-256, SHA-1, SHA-384, and SHA-512, computed with the browser's built-in Web Crypto API." },
  { q: "Why no MD5?", a: "MD5 is insecure and not provided by the browser crypto API. Use SHA-256 or stronger." },
  { q: "Is my text uploaded?", a: "No. Hashing runs entirely in your browser. Nothing is sent anywhere." },
];

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Hash Generator", "hash-generator", faqs)) }} /><Client /></>);
}
