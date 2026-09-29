'use client';
import {useEffect,useState} from 'react';
import ToolShell from './ToolShell';import DropZone from './DropZone';
import {processPdfSecurity} from '@/lib/pdf-security';
export default function PdfSecurityTool({mode}:{mode:'protect'|'unlock'}){
  const protecting=mode==='protect';const [file,setFile]=useState<File|null>(null);const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const [busy,setBusy]=useState(false);const [url,setUrl]=useState('');const [error,setError]=useState('');
  useEffect(()=>()=>{if(url)URL.revokeObjectURL(url);},[url]);
  async function process(){
    if(!file||busy)return;setError('');setUrl('');
    if(protecting&&(password.length<8||password!==confirm)){setError('Use at least 8 characters and make sure both passwords match.');return;}
    if(new TextEncoder().encode(password).length>127){setError('Use a password of at most 127 UTF-8 bytes.');return;}
    setBusy(true);try{setUrl(URL.createObjectURL(await processPdfSecurity(file,password,mode)));setPassword('');setConfirm('');}catch(e){setError(e instanceof Error?e.message:'PDF processing failed.');}finally{setBusy(false);}
  }
  return <ToolShell title={protecting?'Protect PDF':'Unlock PDF'} subtitle={protecting?'Add AES-256 password encryption locally. Keep your password safe, we cannot recover it.':'Remove password encryption from a PDF you own using its current password. Original text and layout are preserved.'} badge="Local processing"
    steps={[{icon:'1',title:'Choose a PDF',desc:'Up to 50 MB.'},{icon:'2',title:protecting?'Set a password':'Enter its password',desc:'Your file and password stay on this device.'},{icon:'3',title:'Download',desc:'Save a new copy of your document.'}]}
    faqs={[{q:'Does this preserve my PDF?',a:'QPDF rewrites encryption without rasterizing pages. Text, images, and forms are retained. Rewriting a signed PDF can invalidate its digital signatures.'},{q:'What encryption is used?',a:'Protection uses AES-256. Unlocking requires the correct password for standard PDF encryption. Unsupported or malformed files produce an error, not a success result.'},{q:'Are my files uploaded?',a:'No. The QPDF engine runs in a local Web Worker. Its code is downloaded from this site; your document and password are never sent to a server.'},{q:'What about older protected exports?',a:'Exports from the earlier IYONM implementation were not encrypted and could contain the entered password in metadata. Do not rely on them. Change any password reused for other accounts.'}]}
    related={[{label:protecting?'Unlock PDF':'Protect PDF',href:protecting?'/unlock-pdf':'/protect-pdf'},{label:'Redact PDF',href:'/redact-pdf'}]}>
    <div className="space-y-4">
      {!busy&&<DropZone accept="application/pdf,.pdf" onFiles={files=>{setFile(files[0]??null);setError('');setUrl('');setPassword('');setConfirm('');}} label="Choose a PDF or drop it here" sublabel="Maximum 50 MB. Original files remain unchanged." />}
      {file&&<p className="text-sm break-all">{file.name}</p>}
      {file&&!url&&<><label className="block text-sm">{protecting?'New password':'Current password'}<input type="password" autoComplete="off" value={password} disabled={busy} onChange={e=>setPassword(e.target.value)} className="block w-full border rounded-xl p-3 mt-2" /></label>{protecting&&<label className="block text-sm">Confirm password<input type="password" autoComplete="off" value={confirm} disabled={busy} onChange={e=>setConfirm(e.target.value)} className="block w-full border rounded-xl p-3 mt-2" /></label>}<button className="btn-primary" disabled={busy} onClick={process}>{busy?'Processing locally…':protecting?'Encrypt PDF':'Remove password'}</button></>}
      {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
      {url&&<div role="status" className="space-y-3"><p>{protecting?'Encrypted PDF ready.':'Unlocked PDF ready.'}</p><a className="btn-primary" href={url} download={(file?.name.replace(/\.pdf$/i,'')??'document')+(protecting?'-protected.pdf':'-unlocked.pdf')}>Download PDF</a></div>}
    </div>
  </ToolShell>;
}
