import Link from 'next/link';
import Logo from '@/components/Logo';
import './footer.css';

const columns = [
  {title:'PDF tools',links:[
    {label:'Merge PDF',href:'/merge-pdf'}, {label:'Compress PDF',href:'/compress-pdf'},
    {label:'Convert PDF to Word',href:'/pdf-to-word'}, {label:'Sign PDF',href:'/sign-pdf'},
    {label:'PDF to JSON',href:'/pdf-to-json'}, {label:'Batch Document Renamer',href:'/batch-document-renamer'},
  ]},
  {title:'Image & video',links:[
    {label:'Compress image',href:'/compress-image'}, {label:'Resize image',href:'/resize-image'},
    {label:'Remove background',href:'/remove-background'}, {label:'HEIC to JPG',href:'/convert/heic-to-jpg'},
    {label:'Compress video',href:'/compress-video'}, {label:'Video to GIF',href:'/video-to-gif'},
  ]},
  {title:'Developer & utilities',links:[
    {label:'JSON Formatter',href:'/json-formatter'}, {label:'Regex Tester',href:'/regex-tester'},
    {label:'Base64 Encoder',href:'/base64'}, {label:'Word Counter',href:'/word-counter'},
    {label:'QR Code Generator',href:'/qr-code-generator'}, {label:'Unit Converter',href:'/unit-converter'},
  ]},
  {title:'Company & help',links:[
    {label:'About IYONM',href:'/about'}, {label:'PDF compression guide',href:'/how-to/how-to-compress-a-pdf'},
    {label:'Background removal guide',href:'/how-to/how-to-remove-image-background'},
    {label:'IYONM vs iLovePDF',href:'/ilovepdf-alternative'},
    {label:'Privacy',href:'/privacy'}, {label:'Terms',href:'/terms'},
  ]},
];
function Links({links}:{links:typeof columns[number]['links']}) {
  return <ul>{links.map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>;
}
export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-brand"><Link href="/" aria-label="IYONM home"><Logo size={28} /></Link><p>Everyday tools. Right in your browser.</p></div>
      <nav aria-label="Footer" className="footer-desktop-nav">{columns.map(column=><div key={column.title}><h2>{column.title}</h2><Links links={column.links} /></div>)}</nav>
      <nav aria-label="Footer" className="footer-mobile-nav">{columns.map(column=><details key={column.title}><summary>{column.title}<span aria-hidden="true">+</span></summary><Links links={column.links} /></details>)}</nav>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} IYONM. All rights reserved.</p><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
    </div>
  </footer>;
}
