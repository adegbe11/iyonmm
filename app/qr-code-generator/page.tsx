import type { Metadata } from "next";
import { widgetJsonLd } from "@/components/WidgetShell";
import Client from "./Client";

export const metadata: Metadata = {
  title: "QR Code Generator, Free & No Signup",
  description: "Create a QR code for any link, text, email, or phone number. Free, instant, no signup. Download as PNG. Runs entirely in your browser.",
  alternates: { canonical: "https://iyonm.com/qr-code-generator" },
};

const faqs = [
  { q: "Is this QR code generator free?", a: "Yes, completely free with no limits and no signup." },
  { q: "Do the QR codes expire?", a: "No. The codes are static and never expire. They encode your data directly." },
  { q: "Can I use these commercially?", a: "Yes. The QR codes you generate are yours to use anywhere." },
  { q: "Is my data sent anywhere?", a: "No. The QR code is generated in your browser. Nothing is uploaded." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(widgetJsonLd("QR Code Generator", "qr-code-generator", faqs)) }} />
      <Client />
    </>
  );
}
