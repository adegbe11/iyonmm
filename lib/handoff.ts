// Carries a file from the homepage Universal Dropzone into the tool the user
// picks. Module-level state survives client-side navigation in the App Router,
// so the destination tool's DropZone can auto-load it (one consume only).
let pending: File[] | null = null;

export function setPendingFiles(files: File[]) {
  pending = files;
}

export function takePendingFiles(): File[] | null {
  const p = pending;
  pending = null;
  return p;
}

// Detect which tool category a file belongs to.
export function detectCategory(file: File): "pdf" | "image" | "video" | "word" | "excel" | "unknown" {
  const t = (file.type || "").toLowerCase();
  const n = file.name.toLowerCase();
  if (t === "application/pdf" || n.endsWith(".pdf")) return "pdf";
  if (t.startsWith("image/") || /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif|svg|ico)$/.test(n)) return "image";
  if (t.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv|m4v)$/.test(n)) return "video";
  if (/wordprocessingml|msword/.test(t) || /\.docx?$/.test(n)) return "word";
  if (/spreadsheetml|ms-excel/.test(t) || /\.(xlsx?|csv)$/.test(n)) return "excel";
  return "unknown";
}
