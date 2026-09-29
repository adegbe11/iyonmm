const assert=require('node:assert/strict');
async function main(){
  const {PDFDocument,StandardFonts,degrees}=require('pdf-lib');
  const input=await PDFDocument.create();const font=await input.embedFont(StandardFonts.Helvetica);
  input.addPage([300,400]).drawText('Invoice 1042',{x:20,y:350,font});input.addPage([400,300]).drawText('Page two',{x:20,y:250,font});
  input.getForm().createTextField('name').addToPage(input.getPage(0),{x:20,y:100,width:180,height:20});
  const original=await input.save();const src=await PDFDocument.load(original);assert.equal(src.getPageCount(),2);
  const merged=await PDFDocument.create();for(const file of [src,src]){const pages=await merged.copyPages(file,file.getPageIndices());pages.forEach(p=>merged.addPage(p));}assert.equal((await PDFDocument.load(await merged.save())).getPageCount(),4);
  const extracted=await PDFDocument.create();const [page]=await extracted.copyPages(src,[1]);extracted.addPage(page);page.setRotation(degrees(90));page.setCropBox(10,10,200,200);assert.equal((await PDFDocument.load(await extracted.save())).getPage(0).getRotation().angle,90);
  src.getForm().getTextField('name').setText('Test User');const filled=await PDFDocument.load(await src.save());assert.equal(filled.getForm().getTextField('name').getText(),'Test User');
  const QR=require('qrcode');assert.ok((await QR.toString('https://www.iyonm.com',{type:'svg'})).includes('<svg'));
  const XLSX=require('xlsx');const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([['Invoice','Amount'],['1042',120]]),'Test');const saved=XLSX.write(book,{type:'buffer',bookType:'xlsx'});const loaded=XLSX.read(saved);assert.equal(loaded.Sheets.Test.B2.v,120);
  console.log('PASS: PDF creation/load, page merge/extraction/rotation/crop, form fill round trip, QR rendering, XLSX round trip. Engine smoke tests, not full browser UI tests.');
}main().catch(error=>{console.error(error);process.exitCode=1;});
