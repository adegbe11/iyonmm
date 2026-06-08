import Link from "next/link";
import Logo from "@/components/Logo";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Organize PDF",
    links: [
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Remove Pages", href: "/remove-pages" },
      { label: "Extract Pages", href: "/extract-pages" },
      { label: "Rotate PDF", href: "/rotate-pdf" },
    ],
  },
  {
    title: "Convert",
    links: [
      { label: "PDF to Word", href: "/pdf-to-word" },
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "Word to PDF", href: "/word-to-pdf" },
      { label: "Excel to PDF", href: "/excel-to-pdf" },
      { label: "PDF to Markdown", href: "/pdf-to-markdown" },
    ],
  },
  {
    title: "Image & Media",
    links: [
      { label: "Compress Image", href: "/compress-image" },
      { label: "Resize Image", href: "/resize-image" },
      { label: "Remove Background", href: "/remove-background" },
      { label: "AI Image Upscaler", href: "/image-upscaler" },
      { label: "Compress Video", href: "/compress-video" },
      { label: "Video to GIF", href: "/video-to-gif" },
    ],
  },
  {
    title: "Calculators & Widgets",
    links: [
      { label: "Calculator", href: "/calculator" },
      { label: "Percentage", href: "/percentage-calculator" },
      { label: "Loan Calculator", href: "/loan-calculator" },
      { label: "Age Calculator", href: "/age-calculator" },
      { label: "Unit Converter", href: "/unit-converter" },
      { label: "QR Code Generator", href: "/qr-code-generator" },
    ],
  },
  {
    title: "Developer",
    links: [
      { label: "Word Counter", href: "/word-counter" },
      { label: "JSON Formatter", href: "/json-formatter" },
      { label: "Regex Tester", href: "/regex-tester" },
      { label: ".env Validator", href: "/env-validator" },
      { label: "Sign PDF", href: "/sign-pdf" },
      { label: "Contract Risk Scanner", href: "/ai-legal-auditor" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "vs iLovePDF", href: "/ilovepdf-alternative" },
      { label: "HIPAA-Friendly PDF Tools", href: "/secure/hipaa-compliant-pdf-tools" },
      { label: "Offline PDF Tools", href: "/secure/offline-pdf-tools" },
      { label: "How-To Guides", href: "/how-to/how-to-compress-a-pdf" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socials = [
  { label: "X", href: "#", path: "M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H2l8-9.2L1.3 2H8l4.8 6.3L18.9 2zm-1.2 18h1.9L7.3 4H5.3l12.4 16z" },
  { label: "Reddit", href: "#", path: "M22 12.1a2.1 2.1 0 0 0-3.5-1.6 10.3 10.3 0 0 0-5.2-1.6l.9-4 2.8.6a1.5 1.5 0 1 0 .2-1l-3.3-.7-1.2 5.1a10.3 10.3 0 0 0-5.3 1.6 2.1 2.1 0 1 0-2.3 3.4 4 4 0 0 0 0 .6c0 2.9 3.4 5.3 7.6 5.3s7.6-2.4 7.6-5.3a4 4 0 0 0 0-.6 2.1 2.1 0 0 0 1-1.8zM8 13.5a1.2 1.2 0 1 1 1.2 1.2A1.2 1.2 0 0 1 8 13.5zm6.8 3.2a4.6 4.6 0 0 1-5.6 0 .4.4 0 1 1 .5-.6 3.9 3.9 0 0 0 4.6 0 .4.4 0 0 1 .5.6zm-.2-2a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2z" },
  { label: "GitHub", href: "#", path: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.300-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.6 4.9.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" },
];

export default function Footer() {
  return (
    <footer style={{ background: "white", borderTop: "1px solid var(--apple-border)" }}>
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-8">
        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-3" style={{ color: "var(--apple-black)" }}>{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm transition-colors hover:text-[#673DE6]" style={{ color: "var(--apple-text-secondary)" }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brand + socials */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8" style={{ borderTop: "1px solid var(--apple-border)" }}>
          <div>
            <Link href="/" className="inline-flex items-center mb-2" aria-label="IYONM home"><Logo size={24} /></Link>
            <p className="text-sm max-w-md" style={{ color: "var(--apple-text-secondary)" }}>
              Free PDF, image, and video tools that run entirely in your browser. Nothing uploaded, no limits, no signup.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[#673DE6] hover:text-white" style={{ background: "var(--apple-gray)", color: "var(--apple-black)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6" style={{ borderTop: "1px solid var(--apple-border)" }}>
          <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>
            &copy; {new Date().getFullYear()} IYONM. It&apos;s Your Online No-upload Multitool. All files are processed locally in your browser.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
            <Link href="/privacy" className="text-xs hover:text-[#673DE6]" style={{ color: "var(--apple-text-secondary)" }}>Privacy Policy</Link>
            <Link href="/terms" className="text-xs hover:text-[#673DE6]" style={{ color: "var(--apple-text-secondary)" }}>Terms of Service</Link>
            <Link href="/about" className="text-xs hover:text-[#673DE6]" style={{ color: "var(--apple-text-secondary)" }}>About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
