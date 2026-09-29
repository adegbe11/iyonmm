export type TextSpan = { text: string; x: number; y: number; width: number; height: number; fontName: string; fontSize: number; endOfLine: boolean };
export function makeBlocks(spans: TextSpan[]) {
  const sizes = spans.filter(span=>span.text.trim()).map(span=>span.fontSize).sort((a,b)=>a-b);
  const typical = sizes[Math.floor(sizes.length/2)] || 12;
  const lines: TextSpan[][] = [];
  for (const span of spans) {
    if (!span.text.trim()) continue;
    const previous=lines.at(-1); const last=previous?.at(-1);
    // Preserve PDF content order, rather than claiming a universal reading order.
    if (previous && last && !last.endOfLine && Math.abs(last.y-span.y)<Math.max(2,span.fontSize*.25)) previous.push(span);
    else lines.push([span]);
  }
  return lines.map((line,index)=>{
    const text=line.map(span=>span.text).join(' ').trim();
    const size=Math.max(...line.map(span=>span.fontSize));
    const heading=size>typical*1.2 && text.length<180;
    const list=/^(?:[•●▪]|[-*]|\d+[.)])\s/.test(text);
    return {id:`block-${index+1}`,type:heading?'heading':list?'listItem':'text',text,classification:'heuristic',bounds:{x:Math.min(...line.map(s=>s.x)),y:Math.min(...line.map(s=>s.y)),width:Math.max(...line.map(s=>s.x+s.width))-Math.min(...line.map(s=>s.x)),height:Math.max(...line.map(s=>s.height))},spanIndexes:line.map(span=>spans.indexOf(span))};
  });
}
export function validateJson(source: string): {value: unknown; error: string} {
  try {const value:unknown=JSON.parse(source); if (!value || typeof value!=='object' || Array.isArray(value)) return {value:null,error:'The document JSON must be an object.'}; return {value,error:''};}
  catch {return {value:null,error:'This is not valid JSON. Check commas, quotes, and brackets.'};}
}
