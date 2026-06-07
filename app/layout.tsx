import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE = "https://www.iyonm.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Free Online PDF, Image & Video Tools, No Signup | IYONM",
    template: "%s | IYONM",
  },
  description:
    "IYONM is a free online multitool for PDFs, images, and video that runs 100% in your browser. Compress, convert, merge, edit, and more. Nothing uploaded, no limits, no signup.",
  applicationName: "IYONM",
  keywords: [
    "free online tools", "pdf tools", "image tools", "compress pdf", "merge pdf", "pdf to word",
    "compress image", "remove background", "compress video", "qr code generator", "json formatter",
    "no upload pdf tools", "private pdf tools", "ilovepdf alternative",
  ],
  authors: [{ name: "IYONM" }],
  creator: "IYONM",
  publisher: "IYONM",
  category: "technology",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: "IYONM",
    locale: "en_US",
    url: SITE,
    title: "Free Online PDF, Image & Video Tools, No Signup",
    description:
      "Compress, convert, merge, and edit PDFs, images, and video right in your browser. Nothing uploaded. No limits. No signup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF, Image & Video Tools, No Signup",
    description: "100% in your browser. Nothing uploaded. No limits. No signup.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#673DE6",
  width: "device-width",
  initialScale: 1,
};

// Site-wide Organization + WebSite structured data (helps Google and AI engines
// understand the brand, and enables the sitelinks search box).
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "IYONM",
      url: SITE,
      description: "Free online PDF, image, and video tools that run entirely in your browser.",
      slogan: "It's Your Online No-upload Multitool",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "IYONM",
      publisher: { "@id": `${SITE}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: "var(--apple-white)", color: "var(--apple-black)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
