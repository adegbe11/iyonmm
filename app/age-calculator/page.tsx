import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Age Calculator, Exact Age in Years, Months & Days",
  description: "Calculate your exact age in years, months, days, weeks, and total days. Free, instant, private. Works for any two dates.",
  alternates: { canonical: "https://iyonm.com/age-calculator" },
};

const faqs = [
  { q: "How is age calculated?", a: "We compute the exact difference between your birth date and today, broken into years, months, and days." },
  { q: "Can I calculate age at a specific date?", a: "Yes. Change the 'as of' date to any date you want." },
  { q: "Is my birth date stored?", a: "No. Everything is computed in your browser and never sent anywhere." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Age Calculator", "age-calculator", faqs)) }} />
      <Client />
    </>
  );
}
