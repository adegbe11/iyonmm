export type DocumentFields = { date: string; vendor: string; invoice: string; amount: string };

export function suggestFields(text: string): DocumentFields {
  const iso = text.match(/\b(20\d{2})[-/.](0?[1-9]|1[0-2])[-/.](0?[1-9]|[12]\d|3[01])\b/);
  const named = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(20\d{2})\b/i);
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  let date = '';
  if (iso) {
    const candidate = `${iso[1]}-${iso[2].padStart(2,'0')}-${iso[3].padStart(2,'0')}`;
    const parsed = new Date(`${candidate}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === candidate) date = candidate;
  } else if (named) {
    const candidate = `${named[3]}-${String(months.indexOf(named[1].toLowerCase())+1).padStart(2,'0')}-${named[2].padStart(2,'0')}`;
    const parsed = new Date(`${candidate}T00:00:00Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === candidate) date = candidate;
  }
  const invoiceMatch = text.match(/\binvoice\s*(?:number|no\.?|#|id)?\s*[:#]?\s*([A-Z0-9][A-Z0-9-]{1,30})\b/i)?.[1] ?? '';
  const invoice = /\d/.test(invoiceMatch) ? invoiceMatch : '';
  const vendor = text.match(/^(?:vendor|supplier|from|company)\s*:\s*(.{2,70})$/im)?.[1]?.trim() ?? '';
  const amount = text.match(/\b(?:grand total|amount due|total due|total)\s*:?\s*(?:USD|GBP|EUR|NGN|[$£€₦])?\s*([\d,]+\.\d{2})\b/i)?.[1]?.replaceAll(',','') ?? '';
  return { date, vendor, invoice, amount };
}

export function safeName(value: string): string {
  const clean = value.replace(/\.pdf$/i,'').replace(/[<>:"/\\|?*\x00-\x1f]/g,'').replace(/\s+/g,'_').replace(/^[. ]+|[. ]+$/g,'').slice(0,160);
  return `${!clean ? 'Document' : /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(clean) ? `_${clean}` : clean}.pdf`;
}

export function formatName(pattern: string, fields: DocumentFields, original: string, index: number): string {
  const values: Record<string,string> = { ...fields, original: original.replace(/\.pdf$/i,''), index: String(index+1).padStart(3,'0') };
  return safeName(pattern.replace(/\{(date|vendor|invoice|amount|original|index)\}/g, (_, key: string) => values[key] || `Unknown_${key}`));
}

export function uniqueNames(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((name) => {
    const base = safeName(name); let candidate = base; let count = 2;
    while (used.has(candidate.toLowerCase())) candidate = base.replace(/\.pdf$/i, `_${count++}.pdf`);
    used.add(candidate.toLowerCase()); return candidate;
  });
}

// Store-only ZIP: no recompression and no changes to the original PDF bytes.
export async function createZip(entries: { name: string; file: File }[]): Promise<Blob> {
  const encoder = new TextEncoder(); const local: BlobPart[] = []; const central: Uint8Array[] = []; let offset = 0;
  if (entries.length > 65535) throw new Error('Please download a smaller batch.');
  for (const entry of entries) {
    const data = new Uint8Array(await entry.file.arrayBuffer()); const name = encoder.encode(entry.name);
    let crc = 0xffffffff;
    for (const byte of data) { crc ^= byte; for (let bit=0; bit<8; bit++) crc = (crc>>>1) ^ ((crc&1) ? 0xedb88320 : 0); }
    crc = (crc ^ 0xffffffff) >>> 0;
    const header = new Uint8Array(30+name.length); const h = new DataView(header.buffer);
    h.setUint32(0,0x04034b50,true); h.setUint16(4,20,true); h.setUint16(6,0x800,true); h.setUint16(12,33,true);
    h.setUint32(14,crc,true); h.setUint32(18,data.length,true); h.setUint32(22,data.length,true); h.setUint16(26,name.length,true); header.set(name,30);
    const directory = new Uint8Array(46+name.length); const d = new DataView(directory.buffer);
    d.setUint32(0,0x02014b50,true); d.setUint16(4,20,true); d.setUint16(6,20,true); d.setUint16(8,0x800,true); d.setUint16(14,33,true);
    d.setUint32(16,crc,true); d.setUint32(20,data.length,true); d.setUint32(24,data.length,true); d.setUint16(28,name.length,true); d.setUint32(42,offset,true); directory.set(name,46);
    local.push(header.buffer, data.buffer); central.push(directory); offset += header.length+data.length;
  }
  const size = central.reduce((sum, item) => sum+item.length,0); const end = new Uint8Array(22); const e = new DataView(end.buffer);
  e.setUint32(0,0x06054b50,true); e.setUint16(8,entries.length,true); e.setUint16(10,entries.length,true); e.setUint32(12,size,true); e.setUint32(16,offset,true);
  return new Blob([...local, ...central.map(item => item.buffer as ArrayBuffer), end.buffer], {type:'application/zip'});
}
