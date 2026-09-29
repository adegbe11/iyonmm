const fs=require('node:fs');const assert=require('node:assert/strict');const {PDFDocument,StandardFonts}=require('pdf-lib');const create=require('@neslinesli93/qpdf-wasm');
async function main(){
  const doc=await PDFDocument.create();const font=await doc.embedFont(StandardFonts.Helvetica);doc.addPage().drawText('Keep this text',{font});const input=await doc.save();
  const q=await create({wasmBinary:fs.readFileSync(require.resolve('@neslinesli93/qpdf-wasm/dist/qpdf.wasm')),noInitialRun:true,noExitRuntime:true,print:()=>{},printErr:()=>{}});
  q.FS.writeFile('/in.pdf',input);
  assert.equal(q.callMain(['/in.pdf','--encrypt','test-password','owner-secret','256','--','/encrypted.pdf']),0);
  const encrypted=q.FS.readFile('/encrypted.pdf');assert.ok(new TextDecoder().decode(encrypted).includes('/Encrypt'));
  let wrong=false;try{const code=q.callMain(['--password=incorrect','--decrypt','/encrypted.pdf','/wrong.pdf']);wrong=code!==0;}catch{wrong=true;}assert.ok(wrong);
  assert.equal(q.callMain(['--password=test-password','--decrypt','/encrypted.pdf','/out.pdf']),0);
  const out=q.FS.readFile('/out.pdf');const restored=await PDFDocument.load(out);assert.equal(restored.getPageCount(),1);assert.equal(restored.isEncrypted,false);
  console.log('PASS: AES-256 encryption, wrong-password rejection, decryption, preserved page, unencrypted output.');
}main().catch(e=>{console.error(e);process.exitCode=1});
