import type { Metadata } from "next";
import UnlockPdfClient from "./UnlockPdfClient";

export const metadata: Metadata = {
  title: "Unlock PDF Online Free, Remove a PDF Password",
  description: "Remove password protection from your PDF files. Free, instant, nothing uploaded. Enter the password and download an unlocked copy.",
  alternates: { canonical: "https://iyonm.com/unlock-pdf" },
};

export default function UnlockPdfPage() {
  return <UnlockPdfClient />;
}
