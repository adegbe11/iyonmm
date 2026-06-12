import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Loan Calculator, Monthly Payment & Interest (Free)",
  description: "Calculate monthly payments and total interest for a mortgage, car loan, or personal loan. Free, instant, private.",
  alternates: { canonical: "https://www.iyonm.com/loan-calculator" },
};

const faqs = [
  { q: "How is the monthly payment calculated?", a: "We use the standard amortizing loan formula based on principal, annual interest rate, and term in years." },
  { q: "Does it work for mortgages and car loans?", a: "Yes. It works for any fixed-rate amortizing loan: mortgage, auto, personal, or student loans." },
  { q: "Is my data saved?", a: "No. All math runs in your browser. Nothing is stored or sent." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Loan Calculator", "loan-calculator", faqs)) }} />
      <Client />
    </>
  );
}
