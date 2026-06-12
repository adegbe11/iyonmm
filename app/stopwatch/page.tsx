import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Online Stopwatch, Free with Lap Times",
  description: "A free, precise online stopwatch with lap times. Start, pause, reset. Accurate even in background tabs. No signup.",
  alternates: { canonical: "https://www.iyonm.com/stopwatch" },
};

const faqs = [
  { q: "Is the stopwatch accurate?", a: "Yes. It tracks real elapsed time, so it stays accurate even if the tab is in the background." },
  { q: "Can I record laps?", a: "Yes. Hit Lap while running to record split times." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Stopwatch", "stopwatch", faqs)) }} />
      <Client />
    </>
  );
}
