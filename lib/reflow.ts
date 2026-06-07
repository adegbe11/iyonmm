// Client-side PDF layout analysis: turn positioned text into clean, ordered,
// mobile-friendly blocks. No server, no ML model, just geometry heuristics.

export interface RawItem {
  str: string;
  x: number;      // left, in PDF points (origin top-left after conversion)
  top: number;    // distance from top of page
  width: number;
  size: number;   // font height in points
  bold: boolean;
}

export interface Block {
  type: "h1" | "h2" | "p";
  text: string;
}

// Detect vertical whitespace bands that separate columns.
// Returns column x-ranges left to right.
function detectColumns(items: RawItem[], pageWidth: number): [number, number][] {
  if (items.length < 20) return [[0, pageWidth]];
  const BINS = 100;
  const binW = pageWidth / BINS;
  const covered = new Array(BINS).fill(0);
  for (const it of items) {
    const start = Math.max(0, Math.floor(it.x / binW));
    const end = Math.min(BINS - 1, Math.floor((it.x + it.width) / binW));
    for (let b = start; b <= end; b++) covered[b]++;
  }
  // An empty band must be a run of empty bins wide enough and away from margins.
  const minGapBins = Math.max(3, Math.round(BINS * 0.035));
  const margin = Math.round(BINS * 0.08);
  const separators: number[] = [];
  let run = 0;
  for (let b = 0; b < BINS; b++) {
    if (covered[b] === 0) {
      run++;
    } else {
      if (run >= minGapBins) {
        const center = (b - run / 2) * binW;
        if (center > margin * binW && center < pageWidth - margin * binW) separators.push(center);
      }
      run = 0;
    }
  }
  if (!separators.length) return [[0, pageWidth]];
  const bounds = [0, ...separators, pageWidth];
  const cols: [number, number][] = [];
  for (let i = 0; i < bounds.length - 1; i++) cols.push([bounds[i], bounds[i + 1]]);
  return cols;
}

function median(nums: number[]): number {
  if (!nums.length) return 12;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

interface Line { top: number; size: number; bold: boolean; text: string }

function groupLines(items: RawItem[]): Line[] {
  const sorted = [...items].sort((a, b) => a.top - b.top || a.x - b.x);
  const lines: Line[] = [];
  let cur: RawItem[] = [];
  let curTop = -Infinity;
  for (const it of sorted) {
    const tol = Math.max(2, it.size * 0.5);
    if (cur.length && Math.abs(it.top - curTop) > tol) {
      lines.push(buildLine(cur));
      cur = [];
    }
    cur.push(it);
    curTop = cur.length === 1 ? it.top : curTop;
  }
  if (cur.length) lines.push(buildLine(cur));
  return lines;
}

function buildLine(items: RawItem[]): Line {
  const ordered = [...items].sort((a, b) => a.x - b.x);
  let text = "";
  let prevEnd = -Infinity;
  for (const it of ordered) {
    const gap = it.x - prevEnd;
    if (text && gap > it.size * 0.25) text += " ";
    text += it.str;
    prevEnd = it.x + it.width;
  }
  const sizes = items.map((i) => i.size);
  const boldShare = items.filter((i) => i.bold).length / items.length;
  return { top: Math.min(...items.map((i) => i.top)), size: median(sizes), bold: boldShare > 0.6, text: text.replace(/\s+/g, " ").trim() };
}

// Turn lines into paragraphs and headings.
function linesToBlocks(lines: Line[], bodySize: number): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let prevBottom: number | null = null;
  let prevSize = bodySize;

  const flush = () => {
    if (para.length) {
      const text = para.join(" ").replace(/\s+/g, " ").trim();
      if (text) blocks.push({ type: "p", text });
      para = [];
    }
  };

  for (const ln of lines) {
    if (!ln.text) continue;
    const isHeading = ln.size >= bodySize * 1.5 || (ln.size >= bodySize * 1.15 && ln.bold && ln.text.length < 90);
    const gap = prevBottom === null ? 0 : ln.top - prevBottom;
    const bigGap = gap > prevSize * 1.4;

    if (isHeading) {
      flush();
      blocks.push({ type: ln.size >= bodySize * 1.8 ? "h1" : "h2", text: ln.text });
    } else {
      if (bigGap) flush();
      para.push(ln.text);
    }
    prevBottom = ln.top + ln.size;
    prevSize = ln.size;
  }
  flush();
  return blocks;
}

export function reflowPage(items: RawItem[], pageWidth: number): Block[] {
  const clean = items.filter((i) => i.str && i.str.trim());
  if (!clean.length) return [];
  const cols = detectColumns(clean, pageWidth);
  const allLines: Line[] = [];
  for (const [x0, x1] of cols) {
    const colItems = clean.filter((i) => {
      const cx = i.x + i.width / 2;
      return cx >= x0 && cx < x1;
    });
    allLines.push(...groupLines(colItems));
  }
  // Body size: median weighted by text length.
  const sizeSamples: number[] = [];
  for (const ln of allLines) for (let k = 0; k < Math.max(1, ln.text.length); k++) sizeSamples.push(ln.size);
  const bodySize = median(sizeSamples);
  return linesToBlocks(allLines, bodySize);
}

// Merge a paragraph that was split across a page break (no heading between, line continues).
export function stitch(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    const last = out[out.length - 1];
    if (
      last && last.type === "p" && b.type === "p" &&
      !/[.!?:;]["')\]]?$/.test(last.text) && /^[a-z(]/.test(b.text)
    ) {
      last.text = (last.text + " " + b.text).replace(/\s+/g, " ");
    } else {
      out.push({ ...b });
    }
  }
  return out;
}
