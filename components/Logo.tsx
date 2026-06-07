// IYONM wordmark: the "O" is a blue circle with a white download arrow.
export default function Logo({ size = 22 }: { size?: number }) {
  const circle = Math.round(size * 1.08);
  return (
    <span className="inline-flex items-center font-extrabold tracking-tight select-none" style={{ fontSize: size, lineHeight: 1, color: "var(--apple-black)" }}>
      IY
      <span className="inline-flex items-center justify-center rounded-full" style={{ width: circle, height: circle, background: "var(--apple-blue)", margin: "0 1px" }}>
        <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v13M6 12l6 6 6-6" />
        </svg>
      </span>
      NM
    </span>
  );
}
