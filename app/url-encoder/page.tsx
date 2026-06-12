import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "URL Encode and Decode Online Free",
  description: "Percent-encode text for URLs or decode encoded URLs back to text. Free, private, runs entirely in your browser.",
  alternates: { canonical: "https://iyonm.com/url-encoder" },
};

const faqs = [
  { q: "What does URL encoding do?", a: "It converts characters that are not safe in a URL (spaces, &, ?, etc.) into percent-encoded form so links and query strings work correctly." },
  { q: "Is my data uploaded?", a: "No. Everything runs in your browser. Nothing is sent anywhere." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("URL Encode / Decode", "url-encoder", faqs)) }} /><Client /></>);
}
