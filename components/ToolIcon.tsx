interface Props {
  icon: string;
  color: string;
  size?: number;
}

// Renders a rounded colored tile with a white glyph, iLovePDF-style.
export default function ToolIcon({ icon, color, size = 44 }: Props) {
  const glyph = glyphs[icon] || glyphs.default;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 4px 12px ${color}33`,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {glyph}
      </svg>
    </div>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  merge: <><path d="M8 7H5a2 2 0 0 0-2 2v3" /><path d="M16 17h3a2 2 0 0 0 2-2v-3" /><path d="M3 12h7l-2-2m2 2-2 2" /><path d="M21 12h-7l2-2m-2 2 2 2" /></>,
  split: <><rect x="3" y="3" width="8" height="18" rx="1" /><rect x="13" y="3" width="8" height="18" rx="1" /></>,
  remove: <><path d="M6 4h12v16H6z" /><path d="M9 9l6 6m0-6l-6 6" /></>,
  extract: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /><path d="M9 14h6m-3-3v6" /></>,
  compress: <><path d="M4 9V5h4" /><path d="M20 9V5h-4" /><path d="M4 15v4h4" /><path d="M20 15v4h-4" /><path d="M9 9l-3-3m12 0l-3 3M9 15l-3 3m12 0l-3-3" /></>,
  ocr: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
  pdf2img: <><path d="M4 4h10l4 4v12H4z" /><circle cx="9" cy="12" r="1.5" /><path d="M6 18l3-3 2 2 3-4 4 5" /></>,
  img2pdf: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="M21 16l-5-5L5 19" /></>,
  word: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /><path d="M7.5 12l1.2 5 1.3-4 1.3 4 1.2-5" /></>,
  excel: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /><path d="M8 12l4 5m0-5l-4 5" /></>,
  rotate: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 3v5h-5" /></>,
  watermark: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" /></>,
  pagenum: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 17h6" /><path d="M11 14l1-1v4" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  unlock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></>,
  compressimg: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 12l3-3m-3 3l3 3M16 12l-3-3m3 3l-3 3" /></>,
  resize: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6" /><path d="M15 9l-6 6" /></>,
  magic: <><path d="M15 4V2m0 6V6m3 1h2m-6 0H9" /><path d="M5 19l9-9 1.5 1.5-9 9z" /><path d="M14 7l3 3" /></>,
  convertimg: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 10l-2 2 2 2m8-4l2 2-2 2" /></>,
  default: <><path d="M4 4h10l4 4v12H4z" /><path d="M14 4v4h4" /></>,
};
