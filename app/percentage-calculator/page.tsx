import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Percentage Calculator, Free & Instant",
  description: "Calculate percentages, percentage of a number, and percentage change for free. Instant, no signup, works in your browser.",
  alternates: { canonical: "https://www.iyonm.com/percentage-calculator" },
};

const faqs = [
  { q: "How do I calculate a percentage of a number?", a: "Enter the percentage and the number, e.g. 20% of 150 = 30." },
  { q: "Can it calculate percentage change?", a: "Yes. Use the 'percentage change' mode to find the increase or decrease between two numbers." },
  { q: "Is it free?", a: "Yes, free with no signup. Everything runs in your browser." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Percentage Calculator", "percentage-calculator", faqs)) }} />
      <Client />
    </>
  );
}
