import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "IyonM, Free PDF and Image Tools. No Upload. No Limits.",
    template: "%s | IyonM",
  },
  description: "Free PDF & image tools. Files processed in your browser, nothing uploaded, no limits, no signup required.",
  keywords: ["pdf tools", "image tools", "compress pdf", "merge pdf", "image compressor", "free online tools"],
  metadataBase: new URL("https://iyonm.com"),
  openGraph: {
    type: "website",
    siteName: "IyonM",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ background: "var(--apple-white)", color: "var(--apple-black)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
