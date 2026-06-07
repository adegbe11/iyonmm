// Programmatic SEO data: one entry per real, high-intent search target.

export interface CompressTarget {
  slug: string;       // URL segment, e.g. "100kb"
  bytes: number;      // target size in bytes
  label: string;      // "100 KB"
}

// Grounded in real demand: forms, job/college applications, email, web uploads.
export const compressTargets: CompressTarget[] = [
  { slug: "10kb", bytes: 10 * 1024, label: "10 KB" },
  { slug: "20kb", bytes: 20 * 1024, label: "20 KB" },
  { slug: "30kb", bytes: 30 * 1024, label: "30 KB" },
  { slug: "50kb", bytes: 50 * 1024, label: "50 KB" },
  { slug: "100kb", bytes: 100 * 1024, label: "100 KB" },
  { slug: "150kb", bytes: 150 * 1024, label: "150 KB" },
  { slug: "200kb", bytes: 200 * 1024, label: "200 KB" },
  { slug: "250kb", bytes: 250 * 1024, label: "250 KB" },
  { slug: "300kb", bytes: 300 * 1024, label: "300 KB" },
  { slug: "500kb", bytes: 500 * 1024, label: "500 KB" },
  { slug: "1mb", bytes: 1024 * 1024, label: "1 MB" },
  { slug: "2mb", bytes: 2 * 1024 * 1024, label: "2 MB" },
  { slug: "3mb", bytes: 3 * 1024 * 1024, label: "3 MB" },
];

export function getCompressTarget(slug: string) {
  return compressTargets.find((t) => t.slug === slug);
}

export interface ResizePreset {
  slug: string;
  name: string;       // "Instagram Post"
  width: number;
  height: number;
  mode: "cover" | "contain"; // cover = crop to fill, contain = fit inside
  note: string;
}

// Grounded in 2026 platform specs.
export const resizePresets: ResizePreset[] = [
  { slug: "instagram-post", name: "Instagram Post", width: 1080, height: 1080, mode: "cover", note: "Square 1:1 feed post." },
  { slug: "instagram-portrait", name: "Instagram Portrait", width: 1080, height: 1350, mode: "cover", note: "4:5 portrait post, the largest feed format." },
  { slug: "instagram-story", name: "Instagram Story", width: 1080, height: 1920, mode: "cover", note: "9:16 full screen story or reel." },
  { slug: "youtube-thumbnail", name: "YouTube Thumbnail", width: 1280, height: 720, mode: "cover", note: "16:9 thumbnail that drives clicks." },
  { slug: "youtube-banner", name: "YouTube Banner", width: 2560, height: 1440, mode: "cover", note: "Channel art, safe text area is the center." },
  { slug: "twitter-header", name: "X (Twitter) Header", width: 1500, height: 500, mode: "cover", note: "3:1 profile header banner." },
  { slug: "facebook-cover", name: "Facebook Cover", width: 1640, height: 924, mode: "cover", note: "Page and profile cover photo." },
  { slug: "linkedin-banner", name: "LinkedIn Banner", width: 1584, height: 396, mode: "cover", note: "Profile background banner." },
  { slug: "profile-picture", name: "Profile Picture", width: 400, height: 400, mode: "cover", note: "Square avatar for any platform." },
  { slug: "1920x1080", name: "1920 x 1080 (Full HD)", width: 1920, height: 1080, mode: "contain", note: "Full HD wallpaper or slide." },
  { slug: "1080x1080", name: "1080 x 1080 (Square)", width: 1080, height: 1080, mode: "cover", note: "Universal square image." },
  { slug: "1280x720", name: "1280 x 720 (HD)", width: 1280, height: 720, mode: "contain", note: "HD 720p image." },
  // More platforms
  { slug: "tiktok-video", name: "TikTok Video", width: 1080, height: 1920, mode: "cover", note: "9:16 full screen vertical video cover." },
  { slug: "pinterest-pin", name: "Pinterest Pin", width: 1000, height: 1500, mode: "cover", note: "2:3 standard pin." },
  { slug: "linkedin-post", name: "LinkedIn Post", width: 1200, height: 627, mode: "cover", note: "Shared link and feed image." },
  { slug: "twitter-post", name: "X (Twitter) Post", width: 1600, height: 900, mode: "cover", note: "16:9 in-feed image." },
  { slug: "facebook-post", name: "Facebook Post", width: 1200, height: 630, mode: "cover", note: "Feed and shared link image." },
  { slug: "discord-banner", name: "Discord Banner", width: 960, height: 540, mode: "cover", note: "Server and profile banner." },
  { slug: "twitch-banner", name: "Twitch Banner", width: 1200, height: 480, mode: "cover", note: "Channel profile banner." },
  { slug: "whatsapp-dp", name: "WhatsApp DP", width: 500, height: 500, mode: "cover", note: "Square profile photo." },
  // Print sizes (300 DPI)
  { slug: "4x6-print", name: "4x6 Print", width: 1200, height: 1800, mode: "cover", note: "Standard photo print at 300 DPI." },
  { slug: "5x7-print", name: "5x7 Print", width: 1500, height: 2100, mode: "cover", note: "Photo print at 300 DPI." },
  { slug: "8x10-print", name: "8x10 Print", width: 2400, height: 3000, mode: "cover", note: "Large photo print at 300 DPI." },
  { slug: "a4", name: "A4 (300 DPI)", width: 2480, height: 3508, mode: "contain", note: "A4 page at print resolution." },
  { slug: "a3", name: "A3 (300 DPI)", width: 3508, height: 4961, mode: "contain", note: "A3 poster at print resolution." },
  // Wallpapers
  { slug: "4k-wallpaper", name: "4K Wallpaper", width: 3840, height: 2160, mode: "cover", note: "Ultra HD 3840 x 2160 desktop wallpaper." },
  { slug: "1440p-wallpaper", name: "1440p Wallpaper", width: 2560, height: 1440, mode: "cover", note: "QHD desktop wallpaper." },
  { slug: "phone-wallpaper", name: "Phone Wallpaper", width: 1170, height: 2532, mode: "cover", note: "Modern smartphone screen size." },
  // Common square and web sizes
  { slug: "og-image", name: "OG Image (1200 x 630)", width: 1200, height: 630, mode: "cover", note: "Open Graph social preview image." },
  { slug: "1024x1024", name: "1024 x 1024 (Square)", width: 1024, height: 1024, mode: "cover", note: "Square image for AI, app icons, and OG." },
  { slug: "512x512", name: "512 x 512", width: 512, height: 512, mode: "cover", note: "App icon and avatar size." },
  { slug: "youtube-channel-icon", name: "YouTube Channel Icon", width: 800, height: 800, mode: "cover", note: "Square channel profile picture." },
  { slug: "etsy-listing", name: "Etsy Listing", width: 2000, height: 2000, mode: "cover", note: "Square product listing photo." },
  { slug: "shopify-product", name: "Shopify Product", width: 2048, height: 2048, mode: "cover", note: "Square product image." },
  { slug: "ebay-listing", name: "eBay Listing", width: 1600, height: 1600, mode: "cover", note: "Square listing photo." },
  { slug: "zoom-background", name: "Zoom Background", width: 1920, height: 1080, mode: "cover", note: "Virtual meeting background." },
];

// Passport and visa photo specs by country (real official sizes).
export interface PassportSpec {
  slug: string;
  country: string;
  width: number;   // pixels at 300 DPI
  height: number;
  physical: string; // human description
}

export const passportSpecs: PassportSpec[] = [
  { slug: "us", country: "United States", width: 600, height: 600, physical: "2 x 2 inches (51 x 51 mm)" },
  { slug: "uk", country: "United Kingdom", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "india", country: "India", width: 600, height: 600, physical: "51 x 51 mm (2 x 2 in)" },
  { slug: "canada", country: "Canada", width: 591, height: 827, physical: "50 x 70 mm" },
  { slug: "australia", country: "Australia", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "schengen", country: "Schengen / EU", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "china", country: "China", width: 390, height: 567, physical: "33 x 48 mm" },
  { slug: "germany", country: "Germany", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "france", country: "France", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "japan", country: "Japan", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "philippines", country: "Philippines", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "nigeria", country: "Nigeria", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "pakistan", country: "Pakistan", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "brazil", country: "Brazil", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "mexico", country: "Mexico", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "south-africa", country: "South Africa", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "italy", country: "Italy", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "spain", country: "Spain", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "bangladesh", country: "Bangladesh", width: 531, height: 650, physical: "45 x 55 mm" },
  { slug: "indonesia", country: "Indonesia", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "turkey", country: "Turkey", width: 591, height: 709, physical: "50 x 60 mm" },
  { slug: "saudi-arabia", country: "Saudi Arabia", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "uae", country: "United Arab Emirates", width: 508, height: 650, physical: "43 x 55 mm" },
  { slug: "egypt", country: "Egypt", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "kenya", country: "Kenya", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "ghana", country: "Ghana", width: 600, height: 600, physical: "2 x 2 inches" },
  { slug: "vietnam", country: "Vietnam", width: 472, height: 709, physical: "40 x 60 mm" },
  { slug: "thailand", country: "Thailand", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "malaysia", country: "Malaysia", width: 413, height: 591, physical: "35 x 50 mm" },
  { slug: "singapore", country: "Singapore", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "south-korea", country: "South Korea", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "russia", country: "Russia", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "netherlands", country: "Netherlands", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "new-zealand", country: "New Zealand", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "ireland", country: "Ireland", width: 413, height: 531, physical: "35 x 45 mm" },
  { slug: "argentina", country: "Argentina", width: 472, height: 472, physical: "40 x 40 mm" },
  { slug: "colombia", country: "Colombia", width: 354, height: 472, physical: "30 x 40 mm" },
];

export function getPassportSpec(slug: string) {
  return passportSpecs.find((p) => p.slug === slug);
}

// How-to guide pages (informational intent, HowTo schema, link to the tool).
export interface Guide {
  slug: string;
  title: string;       // page title / H1
  toolHref: string;
  toolLabel: string;
  intro: string;
  steps: { name: string; text: string }[];
  tips: string;
}

export const guides: Guide[] = [
  {
    slug: "how-to-compress-a-pdf",
    title: "How to Compress a PDF (Free, No Upload)",
    toolHref: "/compress-pdf", toolLabel: "Compress PDF",
    intro: "Need to shrink a PDF so it fits an email or upload limit? Here is the fastest way, with nothing uploaded to a server.",
    steps: [
      { name: "Open the Compress PDF tool", text: "Go to the IYONM Compress PDF page in your browser." },
      { name: "Add your PDF", text: "Drop your file in or click to select it. It stays on your device." },
      { name: "Let it compress", text: "The tool optimizes the file structure automatically." },
      { name: "Download", text: "Save your smaller PDF. If you need an exact size, use Compress PDF to size." },
    ],
    tips: "For a specific target like 200 KB, use the Compress PDF to size tool instead.",
  },
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files (Free, No Upload)",
    toolHref: "/merge-pdf", toolLabel: "Merge PDF",
    intro: "Combine several PDFs into one document in seconds, all in your browser.",
    steps: [
      { name: "Open the Merge PDF tool", text: "Go to the IYONM Merge PDF page." },
      { name: "Add your PDFs", text: "Select two or more PDF files." },
      { name: "Set the order", text: "Drag or use the arrows to arrange the files." },
      { name: "Merge and download", text: "Click Merge and save your combined PDF." },
    ],
    tips: "There is no limit on how many PDFs you can merge.",
  },
  {
    slug: "how-to-convert-heic-to-jpg",
    title: "How to Convert HEIC to JPG (Free, No Upload)",
    toolHref: "/convert/heic-to-jpg", toolLabel: "HEIC to JPG",
    intro: "iPhone photos save as HEIC, which many apps cannot open. Here is how to turn them into universal JPG files.",
    steps: [
      { name: "Open the HEIC to JPG tool", text: "Go to the IYONM HEIC to JPG converter." },
      { name: "Add your HEIC photos", text: "Select one or many HEIC files from your device." },
      { name: "Convert automatically", text: "Each photo is converted to JPG in your browser." },
      { name: "Download", text: "Save your JPG files one by one or all at once." },
    ],
    tips: "You can convert many HEIC photos at the same time.",
  },
  {
    slug: "how-to-compress-an-image-to-100kb",
    title: "How to Compress an Image to 100 KB (Free)",
    toolHref: "/compress-image-to/100kb", toolLabel: "Compress Image to 100 KB",
    intro: "Many forms and applications require photos under 100 KB. Here is how to hit that exact size without guesswork.",
    steps: [
      { name: "Open the Compress to 100 KB tool", text: "Go to the IYONM Compress Image to 100 KB page." },
      { name: "Add your image", text: "Drop in a JPG, PNG, or WebP." },
      { name: "Let it hit the target", text: "The tool lowers quality and size until the file is under 100 KB." },
      { name: "Download", text: "Save the compressed image ready to upload." },
    ],
    tips: "Need a different size? We also have 50 KB, 200 KB, 500 KB, and more.",
  },
  {
    slug: "how-to-resize-an-image-for-instagram",
    title: "How to Resize an Image for Instagram (Free)",
    toolHref: "/resize-image-for/instagram-post", toolLabel: "Resize for Instagram",
    intro: "Instagram looks best at the right size. Here is how to resize any photo to the perfect Instagram dimensions.",
    steps: [
      { name: "Open the Instagram resize tool", text: "Go to the IYONM Resize for Instagram page." },
      { name: "Add your image", text: "Drop in the photo you want to post." },
      { name: "Auto fit to size", text: "The tool scales and crops it to 1080 x 1080 with no stretching." },
      { name: "Download", text: "Save your Instagram ready image." },
    ],
    tips: "We also have Instagram Story (1080 x 1920) and Portrait (1080 x 1350) sizes.",
  },
  {
    slug: "how-to-convert-pdf-to-word",
    title: "How to Convert PDF to Word (Free, No Upload)",
    toolHref: "/pdf-to-word", toolLabel: "PDF to Word",
    intro: "Turn a PDF into an editable Word document right in your browser, without sending your file anywhere.",
    steps: [
      { name: "Open the PDF to Word tool", text: "Go to the IYONM PDF to Word page." },
      { name: "Add your PDF", text: "Select a text based PDF." },
      { name: "Extract and rebuild", text: "The text is pulled out and written into a DOCX file." },
      { name: "Download", text: "Open and edit the DOCX in Word, Google Docs, or Pages." },
    ],
    tips: "Scanned PDFs are images, so run OCR PDF first to get editable text.",
  },
  {
    slug: "how-to-remove-image-background",
    title: "How to Remove a Background from an Image (Free)",
    toolHref: "/remove-background", toolLabel: "Remove Background",
    intro: "Cut out the background of any photo using AI that runs entirely in your browser.",
    steps: [
      { name: "Open the Remove Background tool", text: "Go to the IYONM Remove Background page." },
      { name: "Add your image", text: "Drop in a photo with a clear subject." },
      { name: "Let the AI work", text: "The background is removed locally on your device." },
      { name: "Download", text: "Save a transparent PNG ready for any design." },
    ],
    tips: "The first run downloads the AI model once, then it is fast every time.",
  },
  {
    slug: "how-to-split-a-pdf",
    title: "How to Split a PDF (Free, No Upload)",
    toolHref: "/split-pdf", toolLabel: "Split PDF",
    intro: "Pull single pages or a range out of a PDF in seconds, all in your browser.",
    steps: [
      { name: "Open the Split PDF tool", text: "Go to the IYONM Split PDF page." },
      { name: "Add your PDF", text: "Select the file you want to split." },
      { name: "Choose pages", text: "Split every page, or enter a range like 1-3, 5." },
      { name: "Download", text: "Save the separate files or your chosen range." },
    ],
    tips: "Use Extract Pages if you only want to keep specific pages.",
  },
  {
    slug: "how-to-rotate-a-pdf",
    title: "How to Rotate a PDF (Free, No Upload)",
    toolHref: "/rotate-pdf", toolLabel: "Rotate PDF",
    intro: "Fix sideways or upside down pages in a PDF in seconds, all in your browser.",
    steps: [
      { name: "Open the Rotate PDF tool", text: "Go to the IYONM Rotate PDF page." },
      { name: "Add your PDF", text: "Select the file with the wrong orientation." },
      { name: "Choose the angle", text: "Rotate 90, 180, or 270 degrees." },
      { name: "Download", text: "Save your corrected PDF." },
    ],
    tips: "Use 270 degrees to undo a 90 degree rotation.",
  },
  {
    slug: "how-to-add-a-watermark-to-pdf",
    title: "How to Add a Watermark to a PDF (Free)",
    toolHref: "/watermark-pdf", toolLabel: "Watermark PDF",
    intro: "Stamp text like CONFIDENTIAL or DRAFT across every page of a PDF, all in your browser.",
    steps: [
      { name: "Open the Watermark PDF tool", text: "Go to the IYONM Watermark PDF page." },
      { name: "Add your PDF", text: "Select the file you want to watermark." },
      { name: "Customize the text", text: "Set the words, size, color, opacity, and angle." },
      { name: "Download", text: "Save your watermarked PDF." },
    ],
    tips: "Lower the opacity for a subtle background watermark.",
  },
  {
    slug: "how-to-password-protect-a-pdf",
    title: "How to Password Protect a PDF (Free)",
    toolHref: "/protect-pdf", toolLabel: "Protect PDF",
    intro: "Add a password to a PDF so only the right people can open it, all in your browser.",
    steps: [
      { name: "Open the Protect PDF tool", text: "Go to the IYONM Protect PDF page." },
      { name: "Add your PDF", text: "Select the file you want to protect." },
      { name: "Set a password", text: "Enter and confirm a strong password." },
      { name: "Download", text: "Save your password protected PDF." },
    ],
    tips: "Use our Unlock PDF tool later if you need to remove the password.",
  },
  {
    slug: "how-to-unlock-a-pdf",
    title: "How to Unlock a PDF (Free, No Upload)",
    toolHref: "/unlock-pdf", toolLabel: "Unlock PDF",
    intro: "Remove the password from a PDF you own so it opens without asking, all in your browser.",
    steps: [
      { name: "Open the Unlock PDF tool", text: "Go to the IYONM Unlock PDF page." },
      { name: "Add your PDF", text: "Select the password protected file." },
      { name: "Enter the password", text: "Type the current password you already know." },
      { name: "Download", text: "Save an unlocked copy of your PDF." },
    ],
    tips: "You must know the current password. This only unlocks PDFs you own.",
  },
  {
    slug: "how-to-add-page-numbers-to-pdf",
    title: "How to Add Page Numbers to a PDF (Free)",
    toolHref: "/page-numbers", toolLabel: "Add Page Numbers",
    intro: "Add page numbers to every page of a PDF, all in your browser.",
    steps: [
      { name: "Open the Page Numbers tool", text: "Go to the IYONM Add Page Numbers page." },
      { name: "Add your PDF", text: "Select the file you want to number." },
      { name: "Pick a position", text: "Choose where the numbers appear and the start value." },
      { name: "Download", text: "Save your numbered PDF." },
    ],
    tips: "Set a custom start number for documents that continue from another file.",
  },
  {
    slug: "how-to-convert-word-to-pdf",
    title: "How to Convert Word to PDF (Free, No Upload)",
    toolHref: "/word-to-pdf", toolLabel: "Word to PDF",
    intro: "Turn a Word DOCX into a PDF right in your browser, with nothing uploaded.",
    steps: [
      { name: "Open the Word to PDF tool", text: "Go to the IYONM Word to PDF page." },
      { name: "Add your DOCX", text: "Select your Word document." },
      { name: "Convert", text: "The document is rendered to PDF locally." },
      { name: "Download", text: "Save your PDF." },
    ],
    tips: "Older .doc files should be saved as .docx first.",
  },
  {
    slug: "how-to-convert-excel-to-pdf",
    title: "How to Convert Excel to PDF (Free)",
    toolHref: "/excel-to-pdf", toolLabel: "Excel to PDF",
    intro: "Turn an Excel spreadsheet into a clean PDF, all in your browser.",
    steps: [
      { name: "Open the Excel to PDF tool", text: "Go to the IYONM Excel to PDF page." },
      { name: "Add your spreadsheet", text: "Select an XLSX, XLS, or CSV file." },
      { name: "Convert", text: "Each sheet becomes a table in the PDF." },
      { name: "Download", text: "Save your PDF." },
    ],
    tips: "Charts are not rendered, only the cell values appear.",
  },
  {
    slug: "how-to-convert-image-to-pdf",
    title: "How to Convert an Image to PDF (Free)",
    toolHref: "/image-to-pdf", toolLabel: "Image to PDF",
    intro: "Turn one or many images into a single PDF, all in your browser.",
    steps: [
      { name: "Open the Image to PDF tool", text: "Go to the IYONM Image to PDF page." },
      { name: "Add your images", text: "Select JPGs or PNGs, as many as you want." },
      { name: "Arrange them", text: "Remove or reorder images before converting." },
      { name: "Download", text: "Save your PDF with one image per page." },
    ],
    tips: "Great for turning photos of documents into a single PDF.",
  },
  {
    slug: "how-to-convert-pdf-to-jpg",
    title: "How to Convert PDF to JPG (Free, No Upload)",
    toolHref: "/pdf-to-jpg", toolLabel: "PDF to JPG",
    intro: "Turn every page of a PDF into a JPG image, all in your browser.",
    steps: [
      { name: "Open the PDF to JPG tool", text: "Go to the IYONM PDF to JPG page." },
      { name: "Add your PDF", text: "Select the file to convert." },
      { name: "Pick the resolution", text: "Higher scale gives sharper images." },
      { name: "Download", text: "Save each page or all at once." },
    ],
    tips: "Need lossless images? Use PDF to PNG instead.",
  },
  {
    slug: "how-to-convert-png-to-jpg",
    title: "How to Convert PNG to JPG (Free)",
    toolHref: "/convert/png-to-jpg", toolLabel: "PNG to JPG",
    intro: "Turn PNG images into smaller JPG files, all in your browser.",
    steps: [
      { name: "Open the PNG to JPG tool", text: "Go to the IYONM PNG to JPG converter." },
      { name: "Add your PNGs", text: "Select one or many PNG files." },
      { name: "Convert", text: "Each image is converted to JPG in your browser." },
      { name: "Download", text: "Save your JPGs one by one or all at once." },
    ],
    tips: "Transparent areas in a PNG become white in the JPG.",
  },
  {
    slug: "how-to-resize-an-image",
    title: "How to Resize an Image (Free, No Upload)",
    toolHref: "/resize-image", toolLabel: "Resize Image",
    intro: "Change the width and height of any image, by pixels or percentage, all in your browser.",
    steps: [
      { name: "Open the Resize Image tool", text: "Go to the IYONM Resize Image page." },
      { name: "Add your image", text: "Select a JPG, PNG, or WebP." },
      { name: "Set the size", text: "Enter exact pixels or scale by percentage." },
      { name: "Download", text: "Save your resized image." },
    ],
    tips: "Keep the lock on to preserve the aspect ratio.",
  },
  {
    slug: "how-to-ocr-a-pdf",
    title: "How to OCR a Scanned PDF (Free)",
    toolHref: "/ocr-pdf", toolLabel: "OCR PDF",
    intro: "Pull the text out of a scanned PDF or photo so you can copy and search it, all in your browser.",
    steps: [
      { name: "Open the OCR PDF tool", text: "Go to the IYONM OCR PDF page." },
      { name: "Add your file", text: "Select a scanned PDF or image." },
      { name: "Run OCR", text: "The text is recognized locally on your device." },
      { name: "Copy or download", text: "Copy the text or save it as a .txt file." },
    ],
    tips: "Clear, high resolution scans give the most accurate results.",
  },
  {
    slug: "how-to-remove-pages-from-pdf",
    title: "How to Remove Pages from a PDF (Free)",
    toolHref: "/remove-pages", toolLabel: "Remove Pages",
    intro: "Delete the pages you do not need from a PDF, all in your browser.",
    steps: [
      { name: "Open the Remove Pages tool", text: "Go to the IYONM Remove Pages page." },
      { name: "Add your PDF", text: "Select the file to edit." },
      { name: "Select pages", text: "Click the page numbers you want to remove." },
      { name: "Download", text: "Save your PDF with those pages gone." },
    ],
    tips: "Use Extract Pages if you would rather keep only certain pages.",
  },
  {
    slug: "how-to-make-a-passport-photo",
    title: "How to Make a Passport Photo at Home (Free)",
    toolHref: "/passport-photo/us", toolLabel: "Passport Photo",
    intro: "Crop and size a photo to official passport dimensions for your country, all in your browser.",
    steps: [
      { name: "Open the Passport Photo tool", text: "Choose your country on the IYONM Passport Photo page." },
      { name: "Add your photo", text: "Use a clear, front facing photo on a plain background." },
      { name: "Auto fit to size", text: "The photo is cropped to the official dimensions." },
      { name: "Download", text: "Save your photo to print or upload." },
    ],
    tips: "Always check current government rules for background and expression.",
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function getResizePreset(slug: string) {
  return resizePresets.find((p) => p.slug === slug);
}

// Compress PDF to an exact size (email attachments, upload caps).
export const compressPdfTargets: CompressTarget[] = [
  { slug: "50kb", bytes: 50 * 1024, label: "50 KB" },
  { slug: "100kb", bytes: 100 * 1024, label: "100 KB" },
  { slug: "200kb", bytes: 200 * 1024, label: "200 KB" },
  { slug: "300kb", bytes: 300 * 1024, label: "300 KB" },
  { slug: "500kb", bytes: 500 * 1024, label: "500 KB" },
  { slug: "1mb", bytes: 1024 * 1024, label: "1 MB" },
  { slug: "2mb", bytes: 2 * 1024 * 1024, label: "2 MB" },
  { slug: "5mb", bytes: 5 * 1024 * 1024, label: "5 MB" },
  { slug: "10mb", bytes: 10 * 1024 * 1024, label: "10 MB" },
];

export function getCompressPdfTarget(slug: string) {
  return compressPdfTargets.find((t) => t.slug === slug);
}

// Format-specific image compressors ("compress jpg", "compress png").
export interface CompressFormat {
  slug: string;
  name: string;      // "JPG"
  accept: string;    // input mime filter
  outMime: string;   // output mime
  outExt: string;
  lossless: boolean;
  blurb: string;
}

export const compressFormats: CompressFormat[] = [
  { slug: "jpg", name: "JPG", accept: "image/jpeg", outMime: "image/jpeg", outExt: "jpg", lossless: false, blurb: "Shrink JPG photos with adjustable quality. Great for web, email, and uploads." },
  { slug: "jpeg", name: "JPEG", accept: "image/jpeg", outMime: "image/jpeg", outExt: "jpg", lossless: false, blurb: "Reduce JPEG file size while keeping the photo looking sharp." },
  { slug: "png", name: "PNG", accept: "image/png", outMime: "image/png", outExt: "png", lossless: true, blurb: "Make PNG images smaller while keeping transparency." },
  { slug: "webp", name: "WebP", accept: "image/webp", outMime: "image/webp", outExt: "webp", lossless: false, blurb: "Compress WebP images even further for fast loading pages." },
];

export function getCompressFormat(slug: string) {
  return compressFormats.find((f) => f.slug === slug);
}

// PDF to image format ("pdf to png", "pdf to jpg").
export interface PdfToImage {
  slug: string;
  name: string;     // "PNG"
  mime: string;
  ext: string;
}

export const pdfToImageFormats: PdfToImage[] = [
  { slug: "png", name: "PNG", mime: "image/png", ext: "png" },
];

export function getPdfToImage(slug: string) {
  return pdfToImageFormats.find((f) => f.slug === slug);
}
