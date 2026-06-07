import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - IYONM",
  description: "The terms for using IYONM free online tools. Provided as is, for lawful use, with no warranty.",
  alternates: { canonical: "https://iyonm.com/terms" },
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm mb-8" style={{ color: "var(--apple-text-secondary)" }}>Last updated: June 2026</p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--apple-text-secondary)" }}>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>Acceptance</h2>
          <p>By using IYONM, you agree to these terms. If you do not agree, please do not use the site.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>Free to use</h2>
          <p>The tools are provided free of charge for personal and commercial use. No account or payment is required.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>Acceptable use</h2>
          <p>You agree to use the tools only for lawful purposes and only on files you own or have permission to process. Do not use IYONM to infringe copyright, violate privacy, or break the law.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>No warranty</h2>
          <p>IYONM is provided &quot;as is&quot; without warranties of any kind. Because processing happens in your browser, results can vary by device, browser, and file. Always keep a backup of your original files.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>Limitation of liability</h2>
          <p>To the maximum extent permitted by law, IYONM is not liable for any loss or damage arising from use of the site, including data loss. The Contract Risk Scanner and similar tools are informational only and are not legal advice.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>Changes</h2>
          <p>We may update these terms at any time. Continued use after changes means you accept the updated terms.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--apple-black)" }}>Contact</h2>
          <p>Questions? Email aseincollins@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}
