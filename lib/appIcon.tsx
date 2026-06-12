// Shared "app icon" artwork: blue gradient squircle, white shield, blue "IY" +
// download arrow. Used for the Apple touch icon and the PWA install icons, where
// the icon is shown large. (The favicon uses the simpler circle mark instead.)
const SHIELD =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/></svg>"
  );
const ARROW =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#2563EB' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='M12 4v15M5.5 12.5L12 19l6.5-6.5'/></svg>"
  );

export function appIcon(s: number) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: s * 0.7, height: s * 0.7 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SHIELD} width={s * 0.7} height={s * 0.7} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -s * 0.04 }}>
          <div style={{ display: "flex", fontSize: s * 0.2, fontWeight: 800, color: "#2563EB", letterSpacing: -1, lineHeight: 1 }}>IY</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ARROW} width={s * 0.19} height={s * 0.19} alt="" style={{ marginTop: s * 0.005 }} />
        </div>
      </div>
    </div>
  );
}
