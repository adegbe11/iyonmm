import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Online Timer, Free Countdown with Alarm",
  description: "A free online countdown timer with a sound alert. Set minutes and seconds, start, pause, reset. Accurate even in background tabs.",
  alternates: { canonical: "https://iyonm.com/timer" },
};

const faqs = [
  { q: "Does the timer keep running if I switch tabs?", a: "Yes. It tracks real elapsed time, so it stays accurate even in a background tab." },
  { q: "Will it alert me when time is up?", a: "Yes. It plays a sound when the countdown reaches zero (make sure your volume is on)." },
  { q: "Is it free?", a: "Yes, free with no signup." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("Timer", "timer", faqs)) }} />
      <Client />
    </>
  );
}
