export interface SecurePage {
  slug: string;
  title: string;      // <title>
  h1: string;
  lead: string;
  body: { h: string; p: string }[];
  tools: { label: string; href: string }[];
  faqs: { q: string; a: string }[];
}

const COMMON_TOOLS = [
  { label: "Merge PDF", href: "/merge-pdf" },
  { label: "Compress PDF", href: "/compress-pdf" },
  { label: "Edit PDF", href: "/edit-pdf" },
  { label: "Sign PDF", href: "/sign-pdf" },
  { label: "Redact PDF", href: "/redact-pdf" },
  { label: "PDF to Word", href: "/pdf-to-word" },
];

export const securePages: SecurePage[] = [
  {
    slug: "hipaa-compliant-pdf-tools",
    title: "HIPAA-Compliant Free PDF Tools (No Upload)",
    h1: "HIPAA-Friendly PDF Tools That Never Upload Your Files",
    lead: "Editing patient records, intake forms, or medical PDFs? IYONM processes everything inside your browser, so protected health information (PHI) never travels to a third-party server. That removes an entire class of compliance risk.",
    body: [
      { h: "Why uploading PHI is a compliance problem", p: "Most free PDF sites upload your file to their servers to process it. The moment PHI leaves your device, you have created a data-sharing relationship that typically requires a Business Associate Agreement and exposes you to breach risk. With IYONM there is no upload, no server copy, and no BAA needed, because we never receive the data in the first place." },
      { h: "How IYONM keeps health data local", p: "Every tool runs as JavaScript and WebAssembly in your own browser tab. Your PDF is read into memory on your computer, processed there, and the result is saved straight back to your device. You can confirm it yourself: open your browser's Network tab while you work and you will see zero bytes uploaded." },
      { h: "Always verify your own obligations", p: "IYONM removes the upload risk, but HIPAA compliance is broader than one tool. Follow your organization's policies for device security, access control, and storage of the finished files." },
    ],
    tools: COMMON_TOOLS,
    faqs: [
      { q: "Is IYONM officially HIPAA certified?", a: "There is no government HIPAA certification for software. What matters is that IYONM never uploads or stores your files, so PHI does not leave your device when you use it. Always follow your own organization's compliance policies." },
      { q: "Do you need a Business Associate Agreement?", a: "A BAA covers vendors that handle your PHI. Because IYONM processes files in your browser and never receives them, there is no data handoff to cover." },
      { q: "Can I use these tools at a hospital or clinic?", a: "The tools run in a standard browser with no install. Check with your IT team about local policies, but there is no file upload to block." },
    ],
  },
  {
    slug: "gdpr-compliant-pdf-tools",
    title: "GDPR-Friendly Free PDF Tools (No Upload, No Data Transfer)",
    h1: "GDPR-Friendly PDF Tools With No Data Transfer",
    lead: "Handling EU personal data in PDFs? IYONM never uploads your files, so there is no cross-border data transfer and no third-party processing to document under the GDPR.",
    body: [
      { h: "No upload means no data transfer", p: "Under the GDPR, sending personal data to an external processor, especially outside the EU, triggers obligations around lawful basis, processing agreements, and international transfer safeguards. IYONM processes your PDF entirely in your browser, so none of that applies, because the data never moves." },
      { h: "Data minimisation by design", p: "We cannot lose, leak, or misuse data we never collect. IYONM has no account system, no file storage, and no server-side copy of your documents. That is data minimisation taken to its logical conclusion." },
      { h: "You stay in control", p: "Your files start and end on your own device. There is no retention period to manage and no deletion request to file, because there is nothing on our side to delete." },
    ],
    tools: COMMON_TOOLS,
    faqs: [
      { q: "Does IYONM store my documents?", a: "No. Files are processed in your browser and never uploaded or stored. When you close the tab, anything you were working on is gone from memory." },
      { q: "Is there a cross-border data transfer?", a: "No. Because nothing is uploaded, there is no transfer of personal data to a server in any country." },
      { q: "Do I need a data processing agreement?", a: "A DPA covers processors that handle your data. IYONM never receives your files, so there is no processing on our side to cover." },
    ],
  },
  {
    slug: "edit-pdf-without-uploading",
    title: "Edit PDF Without Uploading, Free & Private",
    h1: "Edit a PDF Without Uploading It Anywhere",
    lead: "Add text, sign, redact, reorder, or fill a PDF without ever sending the file to a server. IYONM does all the work inside your browser, so your document stays private.",
    body: [
      { h: "Why no-upload editing matters", p: "Contracts, IDs, financial statements, and personal records are exactly the documents you do not want sitting on someone else's server, even temporarily. IYONM edits them locally so the file never leaves your computer." },
      { h: "A full editing toolkit, all local", p: "Add or change text, drop in a signature, black out sensitive lines with true redaction, reorder and rotate pages, fill forms, and add page numbers, every one of them running entirely in your browser." },
      { h: "Confirm it yourself", p: "Open your browser's developer tools, switch to the Network tab, and edit your PDF. You will see no upload request, just local processing." },
    ],
    tools: [
      { label: "Edit PDF", href: "/edit-pdf" },
      { label: "Sign PDF", href: "/sign-pdf" },
      { label: "Redact PDF", href: "/redact-pdf" },
      { label: "Fill PDF Forms", href: "/pdf-to-form" },
      { label: "Organize PDF", href: "/organize-pdf" },
      { label: "Watermark PDF", href: "/watermark-pdf" },
    ],
    faqs: [
      { q: "Do I have to upload my PDF?", a: "No. Your file is opened and edited in your browser. It is never uploaded to a server." },
      { q: "Is it really free?", a: "Yes. No signup, no watermarks, no file size limits." },
      { q: "Can I edit on my phone?", a: "Yes. The tools are mobile friendly and still run fully on your device." },
    ],
  },
  {
    slug: "offline-pdf-tools",
    title: "Offline PDF Tools, Work Without Internet",
    h1: "PDF Tools That Work Offline",
    lead: "IYONM is a progressive web app. After your first visit it keeps working with no internet connection, so you can merge, compress, convert, and edit PDFs on a plane, in a secure facility, or anywhere with no signal.",
    body: [
      { h: "How offline works", p: "Because every tool runs on your device, the only thing IYONM needs the network for is loading the page itself. We cache the app on your first visit, so after that the tools keep working with the network turned off." },
      { h: "Perfect for secure environments", p: "Air-gapped or restricted networks often block file-upload sites entirely. IYONM has nothing to upload and can run with no connection at all, which makes it usable where cloud tools simply are not." },
      { h: "Install it like an app", p: "On most browsers you can add IYONM to your home screen or desktop. It then opens in its own window and launches instantly, online or off." },
    ],
    tools: COMMON_TOOLS,
    faqs: [
      { q: "Do the tools really work with no internet?", a: "Yes. After your first visit the app is cached, and since processing happens on your device, the tools keep working offline." },
      { q: "How do I install it?", a: "Use your browser's 'Add to Home Screen' or 'Install app' option. It then runs in its own window." },
      { q: "Is anything uploaded when I am online?", a: "No. Whether online or offline, your files are processed locally and never uploaded." },
    ],
  },
  {
    slug: "compress-pdf-without-uploading",
    title: "Compress PDF Without Uploading, Free & Private",
    h1: "Compress a PDF Without Uploading It",
    lead: "Shrink a PDF for email or upload limits without sending the file to anyone. IYONM compresses it inside your browser, so the document never leaves your device.",
    body: [
      { h: "Private compression", p: "Reducing a file's size should not require handing it to a stranger's server. IYONM compresses your PDF locally, which is faster and keeps the contents private." },
      { h: "Hit an exact size", p: "Need a PDF under 100 KB or 200 KB for a portal? Use Compress PDF to size to land on the exact target, all without an upload." },
      { h: "No caps", p: "Because the work runs on your machine, there are no free-plan file size limits to hit." },
    ],
    tools: [
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Compress PDF to 200 KB", href: "/compress-pdf-to/200kb" },
      { label: "Compress Image", href: "/compress-image" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "PDF to Word", href: "/pdf-to-word" },
    ],
    faqs: [
      { q: "Is my PDF uploaded to compress it?", a: "No. Compression runs in your browser. The file is never uploaded." },
      { q: "Can I compress to an exact size?", a: "Yes. Use the Compress PDF to size tool to target sizes like 100 KB or 200 KB." },
      { q: "Is there a size limit?", a: "No imposed limit. Very large files depend on your device's memory." },
    ],
  },
];

export function getSecurePage(slug: string) {
  return securePages.find((p) => p.slug === slug);
}
