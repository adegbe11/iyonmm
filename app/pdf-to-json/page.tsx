import type { Metadata } from 'next';
import Client from './Client';
export const metadata: Metadata = {title:'PDF to JSON Online Free | IYONM',description:'Extract PDF text, page coordinates, bookmarks, and form fields into JSON. Review and edit the results locally, then download without uploading your document.',alternates:{canonical:'https://www.iyonm.com/pdf-to-json'}};
export default function Page() {return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'SoftwareApplication',name:'PDF to JSON',applicationCategory:'DeveloperApplication',operatingSystem:'Web browser',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}})}} /><Client /></>;}
