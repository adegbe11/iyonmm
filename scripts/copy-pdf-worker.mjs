// Copies the pdf.js worker from node_modules into /public so it is served
// locally and always matches the installed pdfjs-dist version (the CDN does not
// host every npm version). Runs automatically before every build.
import { copyFileSync, existsSync, mkdirSync } from "fs";

const src = "node_modules/pdfjs-dist/build/pdf.worker.min.mjs";
const dest = "public/pdf.worker.min.mjs";

try {
  if (!existsSync("public")) mkdirSync("public");
  copyFileSync(src, dest);
  console.log(`[copy-pdf-worker] copied ${src} -> ${dest}`);
} catch (e) {
  console.error("[copy-pdf-worker] failed:", e.message);
  process.exit(1);
}
