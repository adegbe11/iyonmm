'use client';
import {useRef,useState} from 'react';
import ToolShell from '@/components/ToolShell';
import DropZone from '@/components/DropZone';
import {makeBlocks,validateJson,type TextSpan} from '@/lib/pdf-structure';

export default function Client() {
  const [busy,setBusy]=useState(false); const [status,setStatus]=useState(''); const [error,setError]=useState('');
  const [source,setSource]=useState(''); const [filename,setFilename]=useState('document');
  const [summary,setSummary]=useState({pages:0,blocks:0,fields:0});
  const run=useRef(0); const stop=useRef<null|(()=>Promise<void>)>(null);
  const validation=source?validateJson(source):{value:null,error:''};
  async function extract(files:File[]) {
    if(busy)return;
    const file=files[0]; if(!file)return;
    if(!/\.pdf$/i.test(file.name)){setError('Choose a PDF file.');return;}
    if(file.size>50*1024*1024){setError('Choose a PDF smaller than 50 MB for browser stability.');return;}
    const id=++run.current; setBusy(true);setError('');setSource('');setStatus('Loading the PDF reader…');
    try {
      const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
      if(id!==run.current)return;
      const task=pdfjs.getDocument({data:await file.arrayBuffer()});stop.current=()=>task.destroy();
      try {
        const doc=await task.promise;
        if(doc.numPages>100)throw new Error('This version supports up to 100 pages. Split the PDF first.');
        const pages=[];let blockCount=0;let fieldCount=0;const warnings:string[]=[];
        const metadata=await doc.getMetadata();const outline=await doc.getOutline();
        for(let n=1;n<=doc.numPages;n++) {
          if(id!==run.current)return;setStatus(`Reading page ${n} of ${doc.numPages}…`);
          const page=await doc.getPage(n);const viewport=page.getViewport({scale:1});const content=await page.getTextContent();
          const spans:TextSpan[]=content.items.filter(item=>'str' in item).map(item=>{
            const transform=pdfjs.Util.transform(viewport.transform,item.transform);
            return {text:item.str,x:Math.round(transform[4]*100)/100,y:Math.round(transform[5]*100)/100,width:item.width,height:item.height,fontName:item.fontName,fontSize:Math.hypot(item.transform[2],item.transform[3]),endOfLine:item.hasEOL};
          });
          const blocks=makeBlocks(spans);blockCount+=blocks.length;
          const annotations=await page.getAnnotations();
          const fields=annotations.filter(a=>a.subtype==='Widget').map(a=>({name:a.fieldName??'',type:a.fieldType??'',value:a.fieldValue??null,readOnly:!!a.readOnly,options:a.options??[],pdfBounds:a.rect??null}));fieldCount+=fields.length;
          let taggedStructure=null;try{taggedStructure=await page.getStructTree();}catch{warnings.push(`Page ${n}: tagged structure could not be read.`);}
          if(!spans.some(span=>span.text.trim()))warnings.push(`Page ${n}: no extractable text. Scans require OCR, which is not included in this tool.`);
          pages.push({number:n,width:viewport.width,height:viewport.height,rotation:viewport.rotation,spans,blocks,formFields:fields,taggedStructure});page.cleanup();
        }
        if(id!==run.current)return;
        const info=metadata.info as Record<string,unknown>;
        const result={schemaVersion:'1.0',file:{name:file.name,sizeBytes:file.size,pageCount:doc.numPages},metadata:{title:info.Title??null,author:info.Author??null,subject:info.Subject??null,creator:info.Creator??null},outline: outline?.map(item=>({title:item.title,items:item.items,destination:item.dest}))??[],extraction:{engine:'PDF.js',coordinates:'Text positions use page viewport coordinates at scale 1, origin top left. Form rectangles use native PDF coordinates.',readingOrder:'PDF content stream order. Multi-column layouts may need correction.',blockTypes:'Heading and list classifications are heuristics, not guaranteed document semantics.',limitations:'No OCR, table reconstruction, image export, or AI inference. Review before use.'},warnings,pages};
        setSource(JSON.stringify(result,null,2));setFilename(file.name.replace(/\.pdf$/i,''));setSummary({pages:doc.numPages,blocks:blockCount,fields:fieldCount});setStatus('Ready to review. You can edit the JSON below.');
      } finally {await task.destroy();if(id===run.current)stop.current=null;}
    }catch(e){if(id===run.current){setError(e instanceof Error?e.message:'Unable to read this PDF. It may be protected or damaged.');setStatus('');}}
    finally{if(id===run.current)setBusy(false);}
  }
  async function cancel(){run.current++;await stop.current?.();stop.current=null;setBusy(false);setStatus('Extraction cancelled.');}
  function download(){if(validation.error||!source)return;const blob=new Blob([source],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${filename}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);setStatus('Your edited JSON is ready to download.');}
  async function copy(){try{await navigator.clipboard.writeText(source);setStatus('JSON copied.');}catch{setError('Clipboard access is unavailable. Select the JSON to copy it, or download the file.');}}
  return <ToolShell title="PDF to JSON" subtitle="Turn PDF text and document details into structured data. Review, edit, and download locally. Nothing uploaded."
    steps={[{icon:'1',title:'Choose a PDF',desc:'Text-based PDFs work best.'},{icon:'2',title:'Review the JSON',desc:'Check the extracted text and inferred blocks.'},{icon:'3',title:'Save your data',desc:'Copy or download your edited JSON.'}]}
    faqs={[{q:'What is included?',a:'Page dimensions, positioned text spans, inferred text blocks, available bookmarks, form field values, selected metadata, and tagged structure when the PDF provides it.'},{q:'Does it understand every document?',a:'No. Headings and list items are inferred. Reading order follows the PDF content stream, which can differ from visual order in complex layouts. Review the output.'},{q:'Does it read scanned pages or tables?',a:'This version does not include OCR or table reconstruction. Empty scanned pages are flagged in the JSON warnings. Table text may appear as separate text spans.'},{q:'Are my files uploaded?',a:'No. PDF.js processes your file in this browser. Reader code must load initially, but document data is not sent to a server.'},{q:'Are there limits?',a:'This version supports PDFs up to 50 MB and 100 pages to protect browser memory. JSON output can be much larger than its input.'}]}
    related={[{label:'JSON Formatter',href:'/json-formatter'},{label:'PDF to Text',href:'/pdf-to-text'},{label:'Batch Document Renamer',href:'/batch-document-renamer'}]}>
    <div className="space-y-5">
      {!busy&&<DropZone accept="application/pdf,.pdf" onFiles={extract} label="Choose a PDF or drop it here" sublabel="Up to 50 MB and 100 pages. Your PDF stays on this device." />}
      <p role="status" aria-live="polite" className="text-sm text-gray-600">{status}</p>
      {busy&&<button className="btn-secondary" onClick={cancel}>Cancel extraction</button>}
      {error&&<p role="alert" className="text-red-700 text-sm">{error}</p>}
      {source&&<>
        <p className="text-sm">{summary.pages} pages · {summary.blocks} inferred blocks · {summary.fields} form fields extracted</p>
        <p className="text-xs text-amber-800">Review before using this data. Inferred headings and reading order can be inaccurate. Editing JSON does not change your PDF.</p>
        <label className="block text-sm font-medium" htmlFor="document-json">Review and edit JSON</label>
        <textarea id="document-json" spellCheck={false} value={source} onChange={e=>setSource(e.target.value)} className="w-full min-h-[420px] p-4 font-mono text-xs border rounded-xl" />
        {validation.error&&<p role="alert" className="text-red-700 text-sm">{validation.error}</p>}
        <div className="flex flex-wrap gap-3"><button className="btn-primary" disabled={!!validation.error} onClick={download}>Download JSON</button><button className="btn-secondary" disabled={!!validation.error} onClick={copy}>Copy JSON</button></div>
      </>}
    </div>
  </ToolShell>;
}
