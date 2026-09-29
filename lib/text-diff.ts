export type DiffRow = { type: 'same' | 'add' | 'del'; text: string };

export function diffLines(a: string[], b: string[]): DiffRow[] {
  const n = a.length, m = b.length;
  if ((n + 1) * (m + 1) > 2_000_000) {
    throw new Error('This comparison is too large. Compare smaller sections to keep your browser responsive.');
  }
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const rows: DiffRow[] = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { rows.push({ type: 'same', text: a[i++] }); j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) rows.push({ type: 'del', text: a[i++] });
    else rows.push({ type: 'add', text: b[j++] });
  }
  while (i < n) rows.push({ type: 'del', text: a[i++] });
  while (j < m) rows.push({ type: 'add', text: b[j++] });
  return rows;
}
