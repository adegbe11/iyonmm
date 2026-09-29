'use client';
import { useState } from 'react';
import DropZone from '@/components/DropZone';
import ToolShell from '@/components/ToolShell';
import { suggestFields, formatName, uniqueNames, createZip, type DocumentFields } from '@/lib/document-renamer';

type Row = { file: File; fields: DocumentFields; selected: boolean; note: string; custom: string };
export default function Client() {
  const [rows,setRows] = useState<Row[]>([]);
  const [pattern,setPattern] = useState('{date}_{vendor}_{invoice}');
  const [ocr,setOcr] = useState(false);
  const [busy,setBusy] = useState(false);
  const [status,setStatus] = useState('');
  const [error,setError] = useState('');
  const proposed = rows.map((row,i) => row.custom ? row.custom : formatName(pattern,row.fields,row.file.name,i));
  const selected = rows.map((row,i) => ({row,i})).filter(({row}) => row.selected);
  const names = uniqueNames(selected.map(({i}) => proposed[i]));
  const finalNames = new Map(selected.map(({i},j) => [i,names[j]]));

  async function process(files: File[]) {
    if (busy) return;
    const pdfs = files.filter(file => /\.pdf$/i.test(file.name));
    if (!pdfs.length) {setError('Choose PDF files to get started.'); return;}
    if (pdfs.length > 200 || pdfs.reduce((n,f)=>n+f.size,0) > 250*1024*1024) {setError('For browser stability, choose up to 200 PDFs and 250 MB per batch.'); return;}
    setBusy(true); setError(''); setRows([]);
    const results: Row[] = [];
    let worker: Awaited<ReturnType<typeof import('tesseract.js')['createWorker']>> | undefined;
    try {
      const pdfjs = await import('pdfjs-dist'); pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      for (let i=0;i<pdfs.length;i++) {
        const file = pdfs[i]; setStatus(`Reading ${i+1} of ${pdfs.length}: ${file.name}`);
        let text=''; let note='Suggestions need your review. First 5 pages checked.'; let readable=true;
        const task = pdfjs.getDocument({data:await file.arrayBuffer()});
        try {
          const doc = await task.promise;
          try {
            for (let p=1;p<=Math.min(doc.numPages,5);p++) {
              const page=await doc.getPage(p); const content=await page.getTextContent();
              let pageText='';
              for (const item of content.items) if ('str' in item) pageText+= item.str + (item.hasEOL ? '\n' : ' ');
              if (pageText.trim().length<30 && ocr) {
                setStatus(`Reading scanned page ${p}: ${file.name}`);
                if (!worker) {const {createWorker}=await import('tesseract.js'); worker=await createWorker('eng');}
                const viewport=page.getViewport({scale:Math.min(1.5,1800/page.getViewport({scale:1}).width)});
                const canvas=document.createElement('canvas'); canvas.width=Math.ceil(viewport.width); canvas.height=Math.ceil(viewport.height);
                const ctx=canvas.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable');
                await page.render({canvasContext:ctx,canvas,viewport}).promise;
                pageText=(await worker.recognize(canvas)).data.text; canvas.width=0; canvas.height=0;
              }
              text+=pageText+'\n'; page.cleanup();
            }
          } finally {await task.destroy();}
          if (text.trim().length<30) note=ocr ? 'Little text found. Enter the details yourself.' : 'Scanned or empty PDF. Enable OCR or enter the details yourself.';
        } catch {readable=false; note='Could not read this PDF. It may be protected or damaged. You can still rename it manually.'; await task.destroy();}
        results.push({file,fields:suggestFields(text),selected:readable,note,custom:''}); setRows([...results]);
      }
      setStatus(`${results.length} files ready to review.`);
    } catch {setError('The reader could not start. Check your connection to load the tool, then try again.');}
    finally {await worker?.terminate(); setBusy(false);}
  }
  function update(index:number, change:Partial<Row>) {setRows(current=>current.map((row,i)=>i===index?{...row,...change}:row));}
  async function download() {
    if (!selected.length || busy) return;
    setBusy(true); setError(''); setStatus('Preparing your ZIP. Your PDF contents are unchanged.');
    try {
      const blob=await createZip(selected.map(({row},j)=>({file:row.file,name:names[j]})));
      const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download='IYONM-organised-documents.zip'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),60000);
      setStatus('ZIP ready. Your original files have not been changed.');
    } catch {setError('The ZIP could not be created. Try a smaller batch.');}
    finally {setBusy(false);}
  }
  return <ToolShell title="Batch Document Renamer" subtitle="Give invoices and receipts clearer names. Review every suggestion, then save your files together. Nothing uploaded."
    steps={[{icon:'1',title:'Choose PDFs',desc:'Select invoices or receipts.'},{icon:'2',title:'Review names',desc:'Correct the details and choose a naming pattern.'},{icon:'3',title:'Download a ZIP',desc:'Save copies with new names. Originals stay unchanged.'}]}
    faqs={[{q:'Is this an AI tool?',a:'No. It uses local text extraction and simple detection rules. Suggestions are not guaranteed and should always be reviewed.'},{q:'Can it read scanned PDFs?',a:'Optional English OCR can read scans. OCR downloads its engine and language files, but your documents are not uploaded. Only the first five pages of each PDF are checked.'},{q:'What happens to missing details?',a:'Missing values are shown as Unknown in filenames. Edit the fields or type your own filename before downloading.'},{q:'Are there batch limits?',a:'This version accepts up to 200 PDFs and 250 MB per batch to protect browser memory. Large scans may still be slow, particularly on phones.'}]}
    related={[{label:'Merge PDF',href:'/merge-pdf'},{label:'Extract pages',href:'/extract-pages'}]}>
    <div className="space-y-6">
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={ocr} disabled={busy} onChange={e=>setOcr(e.target.checked)} /><span>Read scanned pages with English OCR <span className="block text-gray-500 mt-1">Optional, slower. Downloads reader assets on first use. Your files stay on this device.</span></span></label>
      {!busy && <DropZone accept="application/pdf,.pdf" multiple onFiles={process} label="Choose PDF files or drop them here" sublabel="Up to 200 files and 250 MB. A new selection replaces this batch." />}
      <p role="status" aria-live="polite" className="text-sm text-gray-600">{status}</p>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {rows.length>0 && <>
        <label className="block text-sm font-medium">Naming pattern<input className="w-full mt-2 p-3 border rounded-xl" value={pattern} disabled={busy} onChange={e=>setPattern(e.target.value)} /></label>
        <p className="text-xs text-gray-500">Available fields: {'{date}, {vendor}, {invoice}, {amount}, {original}, {index}'}. Numeric dates with an unclear day/month order are left blank. Missing details need your review.</p>
        <div className="space-y-4">{rows.map((row,i)=><div className="border rounded-2xl p-4 space-y-3" key={i}>
          <label className="flex gap-3 items-start font-medium break-all"><input type="checkbox" disabled={busy} checked={row.selected} onChange={e=>update(i,{selected:e.target.checked})} />{row.file.name}</label>
          <p className="text-xs text-amber-800">{row.note}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{(['date','vendor','invoice','amount'] as const).map(field=><label className="text-xs capitalize" key={field}>{field}<input className="block w-full border rounded-lg p-2 mt-1 text-sm" value={row.fields[field]} placeholder="Not found" disabled={busy} onChange={e=>update(i,{fields:{...row.fields,[field]:e.target.value}})} /></label>)}</div>
          <label className="block text-xs">Suggested filename, or type your own<input className="w-full mt-1 border rounded-lg p-2 text-sm" disabled={busy} value={proposed[i]} onChange={e=>update(i,{custom:e.target.value})} /></label>
          {row.custom && <button className="text-xs text-purple-700 underline" disabled={busy} onClick={()=>update(i,{custom:''})}>Use naming pattern</button>}
          {row.selected && <p className="text-xs break-all text-gray-500">ZIP filename: {finalNames.get(i)}</p>}
        </div>)}</div>
        <button className="btn-primary" disabled={busy||!selected.length} onClick={download}>{busy?'Working…':`Download ${selected.length} renamed files`}</button>
      </>}
    </div>
  </ToolShell>;
}
