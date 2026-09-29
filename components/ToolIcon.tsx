interface Props {
  icon: string;
  color: string;
  size?: number;
}

// Lightweight vector artwork with a layered app-icon finish.
export default function ToolIcon({ icon, color, size = 44 }: Props) {
  const glyph = glyphs[icon] || glyphs.default;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: `linear-gradient(145deg, color-mix(in srgb, ${color} 76%, white), ${color} 58%, color-mix(in srgb, ${color} 78%, #17203c))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `inset 0 1px 1px #ffffff80, inset 0 -2px 1px #00000018, 0 3px 0 color-mix(in srgb, ${color} 75%, #17203c), 0 7px 14px ${color}30`,
      }}
    >
      <svg aria-hidden="true" width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round">
        {glyph}
      </svg>
    </div>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  merge: <><rect x="3" y="3" width="10" height="14" rx="2" fill="white" fillOpacity=".18" /><rect x="10" y="7" width="11" height="14" rx="2" fill="white" fillOpacity=".3" /><path d="M6 7h4M6 10h2M13 12h5M13 15h5M13 18h3" /></>,
  split: <><path d="M10 3H4v16h6M14 3h6v16h-6" fill="white" fillOpacity=".2" /><path d="M12 2v20" strokeDasharray="2 3" /><path d="m7 9-3 3 3 3m10-6 3 3-3 3" /></>,
  remove: <><path d="M6 4h12v16H6z" /><path d="M9 9l6 6m0-6l-6 6" /></>,
  extract: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /><path d="M9 14h6m-3-3v6" /></>,
  compress: <><path d="M4 9V5h4" /><path d="M20 9V5h-4" /><path d="M4 15v4h4" /><path d="M20 15v4h-4" /><path d="M9 9l-3-3m12 0l-3 3M9 15l-3 3m12 0l-3-3" /></>,
  ocr: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
  pdf2img: <><path d="M4 4h10l4 4v12H4z" /><circle cx="9" cy="12" r="1.5" /><path d="M6 18l3-3 2 2 3-4 4 5" /></>,
  img2pdf: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 16l-5-5L5 19" /></>,
  word: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /><path d="M7.5 12l1.2 5 1.3-4 1.3 4 1.2-5" /></>,
  excel: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /><path d="M8 12l4 5m0-5l-4 5" /></>,
  rotate: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v5h-5" /></>,
  watermark: <><path d="M6 3h9l3 3v15H6z" fill="white" fillOpacity=".18" /><path d="M9 7h5M9 10h6" opacity=".65" /><path d="M10 15v-2a2 2 0 0 1 4 0v2l2 3H8zM7 21h10" /></>,
  qr: <><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3z" fill="white" fillOpacity=".2" /><path d="M6 6h.01M18 6h.01M6 18h.01" strokeWidth="3" /><path d="M13 13h3v3h5M13 18v3h3M19 19v2M21 13v1" /></>,
  calculator: <><rect x="5" y="2" width="14" height="20" rx="3" fill="white" fillOpacity=".2" /><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M15 17v2" /></>,
  timer: <><circle cx="12" cy="13" r="8" fill="white" fillOpacity=".2" /><path d="M9 2h6M12 2v3M18 6l2-2M12 8v5l3 2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" fill="white" fillOpacity=".2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h2M13 14h3M7 18h2M13 18h3" /></>,
  percent: <><circle cx="7" cy="7" r="3" fill="white" fillOpacity=".25" /><circle cx="17" cy="17" r="3" fill="white" fillOpacity=".25" /><path d="m5 20 14-16" strokeWidth="2.5" /></>,
  loan: <><path d="m3 9 9-6 9 6z" fill="white" fillOpacity=".3" /><path d="M5 12v6M10 12v6M15 12v6M20 12v6M3 21h18" /></>,
  ruler: <><path d="m3 16 13-13 5 5L8 21z" fill="white" fillOpacity=".25" /><path d="m8 13 2 2m1-5 2 2m1-5 2 2" /></>,
  code: <><path d="m8 6-5 6 5 6m8-12 5 6-5 6m-3-14-2 16" /></>,
  regex: <><path d="M5 6h5M7.5 3.5v5M5 17h.01" strokeWidth="2.5" /><path d="M15 4v16M11 8l8 8M19 8l-8 8" /></>,
  link: <><path d="m10 7 3-3a5 5 0 0 1 7 7l-3 3M14 17l-3 3a5 5 0 0 1-7-7l3-3M8 16l8-8" /></>,
  hash: <><path d="m9 3-2 18M17 3l-2 18M3 9h18M2 16h18" strokeWidth="2.2" /></>,
  fingerprint: <><path d="M4 12a8 8 0 0 1 16 0M7 20v-8a5 5 0 0 1 10 0v3M10 21v-9a2 2 0 0 1 4 0v7M4 16v2M17 19v2M20 16v4" /></>,
  text: <><path d="M4 5h16M12 5v14M8 19h8M4 9V5M20 9V5" /><path d="M3 22h18" opacity=".5" /></>,
  diff: <><path d="M3 4h7v16H3zM14 4h7v16h-7z" fill="white" fillOpacity=".18" /><path d="M5 9h3M5 13h3M16 9h3M16 13h3M17.5 11.5v3" /></>,
  video: <><rect x="2" y="5" width="20" height="14" rx="3" fill="white" fillOpacity=".2" /><path d="m10 9 5 3-5 3z" fill="white" stroke="none" /><path d="M6 5v14M18 5v14" opacity=".5" /></>,
  upscale: <><rect x="5" y="7" width="12" height="12" rx="2" fill="white" fillOpacity=".2" /><path d="m7 16 3-3 3 2 2-3M15 3h6v6M21 3l-7 7" /></>,
  crop: <><path d="M7 2v15h15M2 7h15v15" /><path d="M10 4h10v10" strokeDasharray="2 3" opacity=".65" /></>,
  pen: <><path d="m5 15 11-11a2 2 0 0 1 4 4L9 19l-5 1z" fill="white" fillOpacity=".25" /><path d="m14 6 4 4M3 23h18" /></>,
  redact: <><path d="M6 3h9l3 3v15H6z" fill="white" fillOpacity=".2" /><path d="M9 7h5M9 11h6M9 16h6" strokeWidth="3" /></>,
  form: <><rect x="4" y="3" width="16" height="18" rx="2" fill="white" fillOpacity=".15" /><path d="M8 7h8M8 11h3M8 16l2 2 5-5" /></>,
  shield: <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6z" fill="white" fillOpacity=".2" /><path d="M12 7v6M12 17h.01" strokeWidth="2" /></>,
  scan: <><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M2 12h20" /><path d="M7 7h10v10H7z" fill="white" fillOpacity=".18" stroke="none" /></>,
  repair: <><path d="M13 6a5 5 0 0 0-6 6l-4 4a2.8 2.8 0 0 0 4 4l4-4a5 5 0 0 0 6-6l-3 3-3-3 3-3z" fill="white" fillOpacity=".2" /><path d="M19 2v4M17 4h4" /></>,
  pagenum: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 17h6" /><path d="M11 14l1-1v4" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  unlock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></>,
  compressimg: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 12l3-3m-3 3l3 3M16 12l-3-3m3 3l-3 3" /></>,
  resize: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6" /><path d="M15 9l-6 6" /></>,
  magic: <><path d="M15 4V2m0 6V6m3 1h2m-6 0H9" /><path d="M5 19l9-9 1.5 1.5-9 9z" /><path d="M14 7l3 3" /></>,
  convertimg: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 10l-2 2 2 2m8-4l2 2-2 2" /></>,
  default: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /></>,
};
