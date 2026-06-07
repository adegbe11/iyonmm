import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "IYONM, Free Online PDF, Image & Video Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "center", padding: "80px",
          background: "linear-gradient(135deg, #ffffff 0%, #F5F3FF 100%)", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 64, fontWeight: 800, color: "#1D1D1F", letterSpacing: -2 }}>
            IY
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 66, height: 66, borderRadius: 999, background: "#673DE6", margin: "0 4px" }}>
              <div style={{ display: "flex", color: "white", fontSize: 44, marginTop: -6 }}>↓</div>
            </div>
            NM
          </div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: "#1D1D1F", lineHeight: 1.1, letterSpacing: -2 }}>
          Free Online PDF, Image
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, color: "#673DE6", lineHeight: 1.1, letterSpacing: -2, marginBottom: 28 }}>
          &amp; Video Tools
        </div>
        <div style={{ fontSize: 32, color: "#6E6E73" }}>
          Nothing uploaded. No limits. No signup.
        </div>
      </div>
    ),
    { ...size }
  );
}
