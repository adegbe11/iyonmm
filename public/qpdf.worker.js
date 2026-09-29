importScripts('/qpdf/qpdf.js');
self.onmessage=async ({data})=>{
  try {
    const qpdf=await Module({locateFile:()=>'/qpdf/qpdf.wasm',noInitialRun:true,noExitRuntime:true,print:()=>{},printErr:()=>{}});
    qpdf.FS.writeFile('/input.pdf',new Uint8Array(data.bytes));
    let args;
    if(data.mode==='protect')args=['/input.pdf','--encrypt',data.password,data.ownerPassword,'256','--','/output.pdf'];
    else args=['--password='+data.password,'--decrypt','/input.pdf','/output.pdf'];
    const code=qpdf.callMain(args);
    if(code!==0 && code!==3)throw new Error('PDF processing failed. Check the password and file.');
    const output=qpdf.FS.readFile('/output.pdf');
    const copy=new Uint8Array(output);self.postMessage({bytes:copy.buffer},[copy.buffer]);
  }catch{self.postMessage({error:'Could not process this PDF. Check the password, or try a valid PDF with standard password encryption.'});}
};
