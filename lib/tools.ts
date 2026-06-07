export type Category = "organize" | "optimize" | "convert" | "edit" | "security" | "image" | "calculators" | "developer" | "widgets";

export interface Tool {
  label: string;
  href: string;
  desc: string;
  icon: string; // icon key in ToolIcon
  color: string; // accent color for the icon tile
  categories: Category[];
}

export const categories: { key: Category | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "organize", label: "Organize PDF" },
  { key: "optimize", label: "Optimize PDF" },
  { key: "convert", label: "Convert PDF" },
  { key: "edit", label: "Edit PDF" },
  { key: "security", label: "PDF Security" },
  { key: "image", label: "Image Tools" },
  { key: "widgets", label: "Widgets" },
  { key: "calculators", label: "Calculators" },
  { key: "developer", label: "Developer" },
];

export const tools: Tool[] = [
  // Organize
  { label: "Merge PDF", href: "/merge-pdf", desc: "Combine PDFs in the order you want.", icon: "merge", color: "#FF5B47", categories: ["organize"] },
  { label: "Split PDF", href: "/split-pdf", desc: "Separate pages into independent files.", icon: "split", color: "#FF5B47", categories: ["organize"] },
  { label: "Remove Pages", href: "/remove-pages", desc: "Delete pages from a PDF.", icon: "remove", color: "#FF5B47", categories: ["organize"] },
  { label: "Extract Pages", href: "/extract-pages", desc: "Save specific pages as a new PDF.", icon: "extract", color: "#FF5B47", categories: ["organize"] },
  // Optimize
  { label: "Compress PDF", href: "/compress-pdf", desc: "Reduce file size, keep quality.", icon: "compress", color: "#34C759", categories: ["optimize"] },
  { label: "OCR PDF", href: "/ocr-pdf", desc: "Make scanned PDFs searchable.", icon: "ocr", color: "#34C759", categories: ["optimize"] },
  { label: "Read PDF on Mobile", href: "/pdf-reflow", desc: "Reflow a PDF into a clean phone view.", icon: "ocr", color: "#34C759", categories: ["optimize"] },
  // Convert
  { label: "PDF to JPG", href: "/pdf-to-jpg", desc: "Convert each page to an image.", icon: "pdf2img", color: "#FFB22C", categories: ["convert"] },
  { label: "JPG to PDF", href: "/jpg-to-pdf", desc: "Turn images into a PDF file.", icon: "img2pdf", color: "#FFB22C", categories: ["convert"] },
  { label: "Image to PDF", href: "/image-to-pdf", desc: "Wrap any images in a PDF.", icon: "img2pdf", color: "#FFB22C", categories: ["convert"] },
  { label: "Word to PDF", href: "/word-to-pdf", desc: "Convert DOC and DOCX to PDF.", icon: "word", color: "#2B7BF3", categories: ["convert"] },
  { label: "Excel to PDF", href: "/excel-to-pdf", desc: "Convert XLS and XLSX to PDF.", icon: "excel", color: "#21A366", categories: ["convert"] },
  { label: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF to editable DOCX.", icon: "word", color: "#2B7BF3", categories: ["convert"] },
  { label: "PDF to Excel", href: "/pdf-to-excel", desc: "Pull tables into a spreadsheet.", icon: "excel", color: "#21A366", categories: ["convert"] },
  // Edit
  { label: "Rotate PDF", href: "/rotate-pdf", desc: "Fix page orientation.", icon: "rotate", color: "#A855F7", categories: ["edit"] },
  { label: "Watermark PDF", href: "/watermark-pdf", desc: "Stamp text on every page.", icon: "watermark", color: "#A855F7", categories: ["edit"] },
  { label: "Page Numbers", href: "/page-numbers", desc: "Add page numbers to a PDF.", icon: "pagenum", color: "#A855F7", categories: ["edit"] },
  { label: "Fill PDF Forms", href: "/pdf-to-form", desc: "Turn a PDF form into a web form.", icon: "watermark", color: "#A855F7", categories: ["edit"] },
  { label: "Contract Risk Scanner", href: "/ai-legal-auditor", desc: "Flag risky clauses in contracts.", icon: "ocr", color: "#5856D6", categories: ["edit"] },
  // Security
  { label: "Protect PDF", href: "/protect-pdf", desc: "Add a password to your PDF.", icon: "lock", color: "#5856D6", categories: ["security"] },
  { label: "Unlock PDF", href: "/unlock-pdf", desc: "Remove a PDF password.", icon: "unlock", color: "#5856D6", categories: ["security"] },
  // Image
  { label: "Compress Image", href: "/compress-image", desc: "Reduce image size, keep quality.", icon: "compressimg", color: "#FF2D92", categories: ["image"] },
  { label: "Resize Image", href: "/resize-image", desc: "Change dimensions in one click.", icon: "resize", color: "#FF2D92", categories: ["image"] },
  { label: "Remove Background", href: "/remove-background", desc: "AI background removal, in browser.", icon: "magic", color: "#FF2D92", categories: ["image"] },
  { label: "HEIC to JPG", href: "/convert/heic-to-jpg", desc: "Convert iPhone photos to JPG.", icon: "convertimg", color: "#FF2D92", categories: ["image", "convert"] },
  // PDF intelligence
  { label: "Sign PDF", href: "/sign-pdf", desc: "Draw or type a signature onto a PDF.", icon: "watermark", color: "#A855F7", categories: ["edit"] },
  { label: "PDF to Markdown", href: "/pdf-to-markdown", desc: "Clean Markdown for Notion & Obsidian.", icon: "word", color: "#FFB22C", categories: ["convert"] },
  // Widgets
  { label: "QR Code Generator", href: "/qr-code-generator", desc: "Turn any link into a QR code.", icon: "split", color: "#1D1D1F", categories: ["widgets"] },
  { label: "Calculator", href: "/calculator", desc: "Fast keyboard calculator.", icon: "pagenum", color: "#FF9500", categories: ["widgets", "calculators"] },
  { label: "Timer", href: "/timer", desc: "Countdown timer with alarm.", icon: "rotate", color: "#FF9500", categories: ["widgets"] },
  { label: "Stopwatch", href: "/stopwatch", desc: "Stopwatch with lap times.", icon: "rotate", color: "#FF9500", categories: ["widgets"] },
  // Calculators
  { label: "Percentage Calculator", href: "/percentage-calculator", desc: "Percentages and changes.", icon: "pagenum", color: "#34C759", categories: ["calculators"] },
  { label: "Age Calculator", href: "/age-calculator", desc: "Exact age in years and days.", icon: "pagenum", color: "#34C759", categories: ["calculators"] },
  { label: "Loan Calculator", href: "/loan-calculator", desc: "Monthly payment and interest.", icon: "pagenum", color: "#34C759", categories: ["calculators"] },
  { label: "Unit Converter", href: "/unit-converter", desc: "Inches to cm, kg to lb, and more.", icon: "convertimg", color: "#34C759", categories: ["calculators"] },
  // Developer & text
  { label: "Word Counter", href: "/word-counter", desc: "Words, characters, reading time.", icon: "ocr", color: "#2B7BF3", categories: ["developer"] },
  { label: "JSON Formatter", href: "/json-formatter", desc: "Beautify, validate, minify JSON.", icon: "extract", color: "#2B7BF3", categories: ["developer"] },
  { label: "Regex Tester", href: "/regex-tester", desc: "Test regex with live highlighting.", icon: "extract", color: "#2B7BF3", categories: ["developer"] },
  { label: ".env Validator", href: "/env-validator", desc: "Check env files for errors & leaks.", icon: "lock", color: "#2B7BF3", categories: ["developer"] },
  // Media (heavy, lazy-loaded)
  { label: "Compress Video", href: "/compress-video", desc: "Shrink video size, no watermark.", icon: "compress", color: "#FF2D92", categories: ["image"] },
  { label: "Video to GIF", href: "/video-to-gif", desc: "Make a clean GIF from a video.", icon: "convertimg", color: "#FF2D92", categories: ["image"] },
  { label: "AI Image Upscaler", href: "/image-upscaler", desc: "Sharpen and enlarge photos up to 4x.", icon: "magic", color: "#FF2D92", categories: ["image"] },
];
