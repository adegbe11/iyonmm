import type { Metadata } from "next";
import PageNumbersClient from "./PageNumbersClient";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online Free",
  description: "Add page numbers to any PDF. Choose position and starting number. Free, client-side, nothing uploaded.",
  alternates: { canonical: "https://iyonm.com/page-numbers" },
};

export default function PageNumbersPage() {
  return <PageNumbersClient />;
}
