export async function processPdfSecurity(file:File,password:string,mode:'protect'|'unlock'):Promise<Blob> {
  if(file.size>50*1024*1024)throw new Error('Choose a PDF smaller than 50 MB.');
  const bytes=await file.arrayBuffer();
  return new Promise((resolve,reject)=>{
    const worker=new Worker('/qpdf.worker.js');
    const timeout=setTimeout(()=>{worker.terminate();reject(new Error('PDF processing timed out. Try a smaller file.'));},120000);
    const finish=()=>{clearTimeout(timeout);worker.terminate();};
    worker.onerror=()=>{finish();reject(new Error('The PDF engine could not load. Reload and try again.'));};
    worker.onmessage=({data})=>{finish();if(data.error)reject(new Error(data.error));else resolve(new Blob([data.bytes],{type:'application/pdf'}));};
    const random=crypto.getRandomValues(new Uint8Array(32));
    const ownerPassword=Array.from(random,n=>n.toString(16).padStart(2,'0')).join('');
    worker.postMessage({bytes,password,ownerPassword,mode},[bytes]);
  });
}
