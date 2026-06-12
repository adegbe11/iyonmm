import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator, Free Online",
  description: "Beautify, validate, and minify JSON instantly. Clear error messages, copy in one click. Free, private, runs in your browser.",
  alternates: { canonical: "https://www.iyonm.com/json-formatter" },
};

const faqs = [
  { q: "What does it do?", a: "It validates, pretty-prints, and minifies JSON. Errors are shown with a clear message so you can fix them fast." },
  { q: "Is my JSON sent anywhere?", a: "No. All parsing happens in your browser. Nothing is uploaded." },
  { q: "Can it handle large files?", a: "Yes, as large as your browser memory allows." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("JSON Formatter", "json-formatter", faqs)) }} />
      <Client />
    </>
  );
}
