import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Word Counter, Free Online Word & Character Count",
  description: "Count words, characters, sentences, paragraphs, and reading time as you type. Free, instant, private. No signup.",
  alternates: { canonical: "https://iyonm.com/word-counter" },
};

const faqs = [
  { q: "What does it count?", a: "Words, characters (with and without spaces), sentences, paragraphs, and estimated reading time." },
  { q: "Is my text saved?", a: "No. Everything is counted in your browser. Nothing is sent or stored." },
  { q: "Is there a length limit?", a: "No. Paste as much text as you like." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Word Counter", "word-counter", faqs)) }} />
      <Client />
    </>
  );
}
