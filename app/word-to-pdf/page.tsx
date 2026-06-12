import type { Metadata } from "next";
import WordToPdfClient from "./WordToPdfClient";

export const metadata: Metadata = {
  title: "Word to PDF Online Free, Convert DOC and DOCX",
  description: "Convert Word documents (DOC, DOCX) to PDF in your browser. Free, no upload, no signup. Formatting preserved best-effort, fully client-side.",
  alternates: { canonical: "https://iyonm.com/word-to-pdf" },
};

export default function WordToPdfPage() {
  return <WordToPdfClient />;
}
