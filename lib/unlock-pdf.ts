// Rebuild an authorised, password-opened PDF as image pages. This intentionally
// does not claim to preserve editable text, forms, links, or signatures.
export async function unlockPdf(file: File, password: string, progress: (page:number,total:number)=>void) {
  if(file.size>50*1024*1024)throw new Error('Choose a PDF smaller than 50 MB.');
  const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
  const {PDFDocument}=await import('pdf-lib');
  const task=pdfjs.getDocument({data:await file.arrayBuffer(),password});
  try {
    const pdf=await task.promise;if(pdf.numPages>100)throw new Error('This version supports up to 100 pages.');
    const output=await PDFDocument.create();
    for(let n=1;n<=pdf.numPages;n++){
      progress(n,pdf.numPages);const page=await pdf.getPage(n);const original=page.getViewport({scale:1});
      const viewport=page.getViewport({scale:Math.min(2,2400/Math.max(original.width,original.height))});
      const canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
      const context=canvas.getContext('2d');if(!context)throw new Error('Your browser cannot render this PDF.');
      await page.render({canvas,canvasContext:context,viewport}).promise;
      const image=await output.embedPng(canvas.toDataURL('image/png'));
      output.addPage([original.width,original.height]).drawImage(image,{x:0,y:0,width:original.width,height:original.height});
      page.cleanup();canvas.width=0;canvas.height=0;
    }
    const bytes=await output.save();return new Blob([bytes.buffer as ArrayBuffer],{type:'application/pdf'});
  }finally{await task.destroy();}
}
