import { ImageResponse } from "next/og";

// Pre-render once at build; the logo never changes.
export const dynamic = "force-static";

const ARROW =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 4v15M5.5 12.5L12 19l6.5-6.5'/></svg>"
  );

const NAVY = "#1B2A4A";

// 512x512 brand logo (IYONM wordmark + gradient download circle + tagline) for
// Organization structured data. Google reads this for the logo shown next to
// search results and in the knowledge panel.
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 104, fontWeight: 800, color: NAVY, letterSpacing: -3 }}>
          <span style={{ display: "flex" }}>IY</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 112, height: 112, borderRadius: 999, backgroundImage: "linear-gradient(135deg, #2B7BF3 0%, #7A3FF2 100%)", margin: "0 4px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ARROW} width={72} height={72} alt="" />
          </div>
          <span style={{ display: "flex" }}>NM</span>
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 30, fontWeight: 500, color: "#3D4350" }}>
          <span style={{ display: "flex" }}>It&apos;s Your Online No-upload&nbsp;</span>
          <span style={{ display: "flex", color: "#2B7BF3" }}>Multitool</span>
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
