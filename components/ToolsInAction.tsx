import Link from "next/link";

function Frame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid var(--apple-border)", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
      <div className="flex items-center gap-2 px-3 h-9" style={{ background: "var(--apple-gray)", borderBottom: "1px solid var(--apple-border)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        <span className="ml-2 flex-1 text-[11px] truncate px-3 py-1 rounded-md" style={{ background: "white", color: "var(--apple-text-secondary)", border: "1px solid var(--apple-border)" }}>{url}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// QR-like grid (decorative, not scannable)
function QrMock() {
  const m = [
    "1111111010101", "1000001011001", "1011101010111", "1011101000101",
    "1011101011001", "1000001010101", "1111111010101", "0000000011000",
    "1101011101011", "0100010100101", "1110101011101", "0101110001001", "1101011101011",
  ];
  return (
    <svg viewBox="0 0 13 13" width="120" height="120" shapeRendering="crispEdges">
      {m.map((row, y) => row.split("").map((c, x) => c === "1" ? <rect key={x + "-" + y} x={x} y={y} width="1" height="1" fill="#1D1D1F" /> : null))}
    </svg>
  );
}

export default function ToolsInAction() {
  return (
    <section className="px-4 py-16" style={{ background: "var(--apple-gray)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">See your tools in action</h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--apple-text-secondary)" }}>
            Real results, right in your browser. Drop a file in and get a clean, finished output in seconds. No upload, no waiting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Compress Image */}
          <Frame url="iyonm.com/compress-image">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--apple-text-secondary)" }}>Compress Image</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ background: "linear-gradient(135deg,#7AC7FF,#673DE6 70%,#FF8FB1)" }} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">beach-photo.jpg</p>
                <p className="text-xs" style={{ color: "var(--apple-text-secondary)" }}>4.8 MB &rarr; <span style={{ color: "var(--apple-black)", fontWeight: 600 }}>412 KB</span></p>
              </div>
              <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#EBF9EE", color: "#34C759" }}>-91%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "#E8E8ED" }}>
              <div className="h-full rounded-full" style={{ width: "9%", background: "#34C759" }} />
            </div>
            <Link href="/compress-image" className="btn-primary w-full justify-center text-sm" style={{ padding: "9px" }}>Download image</Link>
          </Frame>

          {/* Remove Background */}
          <Frame url="iyonm.com/remove-background">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--apple-text-secondary)" }}>Remove Background</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--apple-text-secondary)" }}>Before</p>
                <div className="aspect-square rounded-xl flex items-end justify-center overflow-hidden" style={{ background: "linear-gradient(135deg,#FFD27A,#FF8FB1)" }}>
                  <Subject />
                </div>
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--apple-text-secondary)" }}>After</p>
                <div className="aspect-square rounded-xl flex items-end justify-center overflow-hidden" style={{ backgroundColor: "#fff", backgroundImage: "repeating-conic-gradient(#E8E8ED 0% 25%, #fff 0% 50%)", backgroundSize: "16px 16px" }}>
                  <Subject />
                </div>
              </div>
            </div>
            <Link href="/remove-background" className="btn-primary w-full justify-center text-sm" style={{ padding: "9px" }}>Get transparent PNG</Link>
          </Frame>

          {/* QR Code */}
          <Frame url="iyonm.com/qr-code-generator">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--apple-text-secondary)" }}>QR Code Generator</p>
            <div className="text-xs px-3 py-2 rounded-lg mb-3 truncate" style={{ background: "var(--apple-gray)", color: "var(--apple-text-secondary)" }}>https://www.iyonm.com</div>
            <div className="flex justify-center mb-4 p-3 rounded-xl" style={{ background: "white", border: "1px solid var(--apple-border)" }}>
              <QrMock />
            </div>
            <Link href="/qr-code-generator" className="btn-primary w-full justify-center text-sm" style={{ padding: "9px" }}>Download PNG</Link>
          </Frame>
        </div>
      </div>
    </section>
  );
}

function Subject() {
  return (
    <svg viewBox="0 0 64 64" className="w-2/3 h-2/3" fill="#fff" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
      <circle cx="32" cy="22" r="13" />
      <path d="M8 64c0-13 11-22 24-22s24 9 24 22z" />
    </svg>
  );
}
