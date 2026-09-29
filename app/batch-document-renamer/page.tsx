import type { Metadata } from 'next';
import Client from './Client';
export const metadata: Metadata = {
  title: 'Batch Rename PDF Files Online Free | IYONM',
  description: 'Organise invoices and receipts with editable filename suggestions. Rename PDFs locally, preview changes, and download a ZIP without uploading your files.',
  alternates: {canonical:'https://www.iyonm.com/batch-document-renamer'},
};
export default function Page() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'SoftwareApplication',name:'Batch Document Renamer',applicationCategory:'UtilitiesApplication',operatingSystem:'Web browser',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}})}} /><Client /></>;
}
