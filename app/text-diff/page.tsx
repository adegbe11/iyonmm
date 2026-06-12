import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Text Diff Checker Online Free, Compare Two Texts",
  description: "Compare two blocks of text and highlight the differences line by line. Free, private, runs entirely in your browser.",
  alternates: { canonical: "https://iyonm.com/text-diff" },
};

const faqs = [
  { q: "Is my text uploaded?", a: "No. The comparison runs entirely in your browser. Nothing is sent anywhere." },
  { q: "How does it compare?", a: "Line by line, using a longest-common-subsequence diff. Added lines are green, removed lines red." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

export default function Page() {
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Text Diff Checker", "text-diff", faqs)) }} /><Client /></>);
}
