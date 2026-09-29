import Link from 'next/link';
import { compressTargets, compressPdfTargets, resizePresets, passportSpecs } from '@/lib/seo-data';
import './home-resources.css';

const groups = [
  {title:'Image file sizes', links:compressTargets.map(t=>({label:t.label,href:`/compress-image-to/${t.slug}`}))},
  {title:'PDF file sizes', links:compressPdfTargets.map(t=>({label:t.label,href:`/compress-pdf-to/${t.slug}`}))},
  {title:'Social & print sizes', links:resizePresets.map(t=>({label:t.name,href:`/resize-image-for/${t.slug}`}))},
  {title:'Passport photos', links:passportSpecs.map(t=>({label:t.country,href:`/passport-photo/${t.slug}`}))},
];
const guides = [
  {title:'Make a PDF smaller',description:'Find the right compression settings for your document.',href:'/how-to/how-to-compress-a-pdf'},
  {title:'Remove an image background',description:'Give your photo a clean, transparent background.',href:'/how-to/how-to-remove-image-background'},
  {title:'Combine your PDF files',description:'Bring separate documents together in the right order.',href:'/how-to/how-to-merge-pdf-files'},
];
export default function HomeResources() {
  return <div className="home-resources">
    <section className="resource-shortcuts" aria-labelledby="shortcuts-title">
      <h2 id="shortcuts-title">Popular shortcuts</h2>
      <p className="resource-intro">Find the size or format you need.</p>
      <div className="shortcut-grid">{groups.map(group=><div key={group.title} className="shortcut-group">
        <h3>{group.title}</h3>
        <ul>{group.links.slice(0,3).map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
        <details><summary>More options <span aria-hidden="true">+</span></summary><ul>{group.links.slice(3).map(link=><li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></details>
      </div>)}</div>
    </section>
    <section className="resource-guides" aria-labelledby="guides-title">
      <h2 id="guides-title">A little help to get it done.</h2>
      <div className="guide-grid">{guides.map(guide=><Link key={guide.href} href={guide.href} className="resource-guide"><h3>{guide.title}<span aria-hidden="true">↗</span></h3><p>{guide.description}</p></Link>)}</div>
    </section>
  </div>;
}
