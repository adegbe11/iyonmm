import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: ".env Validator, Check Env Files for Errors & Leaked Keys",
  description: "Validate your .env file for syntax errors, duplicate keys, and leaked secrets. 100% client-side, your secrets never leave your browser.",
  alternates: { canonical: "https://www.iyonm.com/env-validator" },
};

const faqs = [
  { q: "What does it check?", a: "Syntax errors, duplicate keys, missing values, spaces around the equals sign, unquoted values with spaces, and likely leaked secrets." },
  { q: "Is my .env file uploaded?", a: "No, and that matters here. Everything runs in your browser. Your secrets never leave your device." },
  { q: "Does it detect leaked keys?", a: "It flags values that look like API keys or tokens so you can double-check before committing." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd(".env Validator", "env-validator", faqs)) }} />
      <Client />
    </>
  );
}
