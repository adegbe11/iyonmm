import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Regex Tester, Free Online Regular Expression Tester",
  description: "Test JavaScript regular expressions with live match highlighting and capture groups. Free, private, runs in your browser.",
  alternates: { canonical: "https://iyonm.com/regex-tester" },
};

const faqs = [
  { q: "What regex flavor is this?", a: "JavaScript regular expressions, the same engine used in browsers and Node.js." },
  { q: "Does it highlight matches?", a: "Yes. Every match in your test text is highlighted, with capture groups listed below." },
  { q: "Is my data sent anywhere?", a: "No. The regex runs in your browser. Nothing is uploaded." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Regex Tester", "regex-tester", faqs)) }} />
      <Client />
    </>
  );
}
