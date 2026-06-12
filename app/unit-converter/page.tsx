import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Unit Converter, Inches to cm, kg to lb & More (Free)",
  description: "Convert length, weight, and temperature instantly. Inches to cm, cm to inches, kg to lb, Celsius to Fahrenheit, and more. Free and private.",
  alternates: { canonical: "https://iyonm.com/unit-converter" },
};

const faqs = [
  { q: "What units can I convert?", a: "Length (inches, cm, feet, meters, miles, km), weight (kg, lb, oz, g), and temperature (C, F, K)." },
  { q: "How accurate is it?", a: "It uses exact conversion factors and updates instantly as you type." },
  { q: "Is it free?", a: "Yes, free and private. Everything runs in your browser." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Unit Converter", "unit-converter", faqs)) }} />
      <Client />
    </>
  );
}
