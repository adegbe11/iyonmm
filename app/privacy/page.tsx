import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - IYONM",
  description: "How IYONM handles your data. Files are processed in your browser and never uploaded. Learn what we do and do not collect.",
  alternates: { canonical: "https://www.iyonm.com/privacy" },
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm mb-8" style={{ color: "var(--apple-text-secondary)" }}>Last updated: June 2026</p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--apple-black)" }}>
        <section>
          <h2 className="text-lg font-semibold mb-2">Your files never leave your device</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>IYONM tools process your files entirely inside your web browser. Your documents, images, and videos are never uploaded to our servers, never stored, and never seen by us. When you close the tab, anything you were working on is gone from memory.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">What we collect</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>We do not require an account and do not ask for personal information to use the tools. We may collect anonymous, aggregated usage analytics (such as which tools are popular and general traffic numbers) to improve the site. This data does not identify you.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Cookies and advertising</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>This site may use cookies for basic functionality and analytics. We may also display ads through third-party networks such as Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this and other websites. You can opt out of personalized advertising by visiting Google&apos;s Ads Settings. For more on how Google uses data, see Google&apos;s Privacy &amp; Terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Third-party assets</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>Some tools download processing engines or AI models from public content delivery networks (for example, for PDF rendering, OCR, video, or background removal). These requests fetch code only; your files are not sent in them.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Children&apos;s privacy</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>IYONM is not directed at children under 13 and we do not knowingly collect data from them.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Changes</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>We may update this policy from time to time. Material changes will be reflected by the date at the top of this page.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p style={{ color: "var(--apple-text-secondary)" }}>Questions about this policy? Reach out through the contact options on our website.</p>
        </section>
      </div>
    </div>
  );
}
