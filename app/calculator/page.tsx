import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Calculator Online, Free Full-Screen Calculator",
  description: "A free online calculator that works with your keyboard. No signup, no clutter. Add, subtract, multiply, divide, and percentages instantly.",
  alternates: { canonical: "https://iyonm.com/calculator" },
};

const faqs = [
  { q: "Is this calculator free?", a: "Yes, free with no signup and no ads blocking the buttons." },
  { q: "Does it work on mobile?", a: "Yes. The buttons are large and the layout is fully responsive." },
  { q: "Can I use my keyboard?", a: "Yes. Type numbers and operators, Enter to equals, Backspace to delete, Esc to clear." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Calculator", "calculator", faqs)) }} />
      <Client />
    </>
  );
}
