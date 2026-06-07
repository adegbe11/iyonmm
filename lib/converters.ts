export interface ConvertConfig {
  from: string;
  to: string;
  fromMime: string;
  toMime: string;
  label: string;
  slug: string;
  title: string;
  description: string;
  outputExt: string;
}

export const converters: ConvertConfig[] = [
  {
    from: "HEIC", to: "JPG", fromMime: "image/heic,image/heif", toMime: "image/jpeg",
    label: "HEIC to JPG", slug: "heic-to-jpg", outputExt: "jpg",
    title: "Convert HEIC to JPG Online Free",
    description: "Turn iPhone HEIC photos into JPG in seconds. Free, nothing uploaded, works right in your browser.",
  },
  {
    from: "PNG", to: "JPG", fromMime: "image/png", toMime: "image/jpeg",
    label: "PNG to JPG", slug: "png-to-jpg", outputExt: "jpg",
    title: "Convert PNG to JPG Online Free",
    description: "Convert PNG images to JPEG format for smaller file sizes. Free, no upload, instant browser conversion.",
  },
  {
    from: "JPG", to: "PNG", fromMime: "image/jpeg", toMime: "image/png",
    label: "JPG to PNG", slug: "jpg-to-png", outputExt: "png",
    title: "Convert JPG to PNG Online Free",
    description: "Convert JPEG images to PNG for lossless quality. Free, client-side, no upload required.",
  },
  {
    from: "WebP", to: "PNG", fromMime: "image/webp", toMime: "image/png",
    label: "WebP to PNG", slug: "webp-to-png", outputExt: "png",
    title: "Convert WebP to PNG Online Free",
    description: "Convert WebP images to PNG format. Free, instant, runs in your browser. No upload needed.",
  },
  {
    from: "PNG", to: "WebP", fromMime: "image/png", toMime: "image/webp",
    label: "PNG to WebP", slug: "png-to-webp", outputExt: "webp",
    title: "Convert PNG to WebP Online Free",
    description: "Convert PNG images to WebP for 30% smaller file sizes. Free, client-side conversion.",
  },
  {
    from: "JPG", to: "WebP", fromMime: "image/jpeg", toMime: "image/webp",
    label: "JPG to WebP", slug: "jpg-to-webp", outputExt: "webp",
    title: "Convert JPG to WebP Online Free",
    description: "Convert JPEG photos to modern WebP format. Smaller files, same quality. Free and instant.",
  },
  {
    from: "GIF", to: "PNG", fromMime: "image/gif", toMime: "image/png",
    label: "GIF to PNG", slug: "gif-to-png", outputExt: "png",
    title: "Convert GIF to PNG Online Free",
    description: "Convert GIF images to PNG format (first frame). Free, client-side, no upload.",
  },
  {
    from: "BMP", to: "JPG", fromMime: "image/bmp", toMime: "image/jpeg",
    label: "BMP to JPG", slug: "bmp-to-jpg", outputExt: "jpg",
    title: "Convert BMP to JPG Online Free",
    description: "Convert BMP bitmap images to compressed JPEG format. Free, instant, nothing uploaded.",
  },
  // Expanded matrix, grounded in real search demand
  {
    from: "HEIC", to: "PNG", fromMime: "image/heic,image/heif", toMime: "image/png",
    label: "HEIC to PNG", slug: "heic-to-png", outputExt: "png",
    title: "Convert HEIC to PNG Online Free",
    description: "Turn iPhone HEIC photos into lossless PNG images. Free, nothing uploaded, runs in your browser.",
  },
  {
    from: "HEIC", to: "WebP", fromMime: "image/heic,image/heif", toMime: "image/webp",
    label: "HEIC to WebP", slug: "heic-to-webp", outputExt: "webp",
    title: "Convert HEIC to WebP Online Free",
    description: "Convert iPhone HEIC photos to small WebP files. Free, instant, nothing uploaded.",
  },
  {
    from: "WebP", to: "JPG", fromMime: "image/webp", toMime: "image/jpeg",
    label: "WebP to JPG", slug: "webp-to-jpg", outputExt: "jpg",
    title: "Convert WebP to JPG Online Free",
    description: "Convert WebP images to JPG so they open anywhere. Free, client side, no upload.",
  },
  {
    from: "AVIF", to: "JPG", fromMime: "image/avif", toMime: "image/jpeg",
    label: "AVIF to JPG", slug: "avif-to-jpg", outputExt: "jpg",
    title: "Convert AVIF to JPG Online Free",
    description: "Convert modern AVIF images to JPG that works everywhere. Free, instant, nothing uploaded.",
  },
  {
    from: "AVIF", to: "PNG", fromMime: "image/avif", toMime: "image/png",
    label: "AVIF to PNG", slug: "avif-to-png", outputExt: "png",
    title: "Convert AVIF to PNG Online Free",
    description: "Convert AVIF images to lossless PNG. Free, client side, no upload required.",
  },
  {
    from: "GIF", to: "JPG", fromMime: "image/gif", toMime: "image/jpeg",
    label: "GIF to JPG", slug: "gif-to-jpg", outputExt: "jpg",
    title: "Convert GIF to JPG Online Free",
    description: "Convert a GIF to a JPG image (first frame). Free, instant, nothing uploaded.",
  },
  {
    from: "BMP", to: "PNG", fromMime: "image/bmp", toMime: "image/png",
    label: "BMP to PNG", slug: "bmp-to-png", outputExt: "png",
    title: "Convert BMP to PNG Online Free",
    description: "Convert BMP bitmaps to compact PNG images. Free, client side, no upload.",
  },
  {
    from: "SVG", to: "PNG", fromMime: "image/svg+xml", toMime: "image/png",
    label: "SVG to PNG", slug: "svg-to-png", outputExt: "png",
    title: "Convert SVG to PNG Online Free",
    description: "Turn SVG vector files into PNG raster images at full quality. Free, nothing uploaded.",
  },
  {
    from: "JFIF", to: "JPG", fromMime: "image/jpeg", toMime: "image/jpeg",
    label: "JFIF to JPG", slug: "jfif-to-jpg", outputExt: "jpg",
    title: "Convert JFIF to JPG Online Free",
    description: "Rename and convert JFIF files to standard JPG that opens anywhere. Free, instant, nothing uploaded.",
  },
  {
    from: "GIF", to: "WebP", fromMime: "image/gif", toMime: "image/webp",
    label: "GIF to WebP", slug: "gif-to-webp", outputExt: "webp",
    title: "Convert GIF to WebP Online Free",
    description: "Convert a GIF to a small WebP image. Free, instant, nothing uploaded.",
  },
  {
    from: "BMP", to: "WebP", fromMime: "image/bmp", toMime: "image/webp",
    label: "BMP to WebP", slug: "bmp-to-webp", outputExt: "webp",
    title: "Convert BMP to WebP Online Free",
    description: "Convert BMP bitmaps to compact WebP images. Free, client side, no upload.",
  },
  {
    from: "AVIF", to: "WebP", fromMime: "image/avif", toMime: "image/webp",
    label: "AVIF to WebP", slug: "avif-to-webp", outputExt: "webp",
    title: "Convert AVIF to WebP Online Free",
    description: "Convert AVIF images to widely supported WebP. Free, instant, nothing uploaded.",
  },
  {
    from: "SVG", to: "JPG", fromMime: "image/svg+xml", toMime: "image/jpeg",
    label: "SVG to JPG", slug: "svg-to-jpg", outputExt: "jpg",
    title: "Convert SVG to JPG Online Free",
    description: "Turn SVG vector files into JPG images with a white background. Free, nothing uploaded.",
  },
  {
    from: "ICO", to: "PNG", fromMime: "image/x-icon,image/vnd.microsoft.icon", toMime: "image/png",
    label: "ICO to PNG", slug: "ico-to-png", outputExt: "png",
    title: "Convert ICO to PNG Online Free",
    description: "Convert icon (ICO) files into PNG images. Free, client side, no upload required.",
  },
  {
    from: "Image", to: "WebP", fromMime: "image/jpeg,image/png,image/gif,image/bmp", toMime: "image/webp",
    label: "Image to WebP", slug: "image-to-webp", outputExt: "webp",
    title: "Convert Image to WebP Online Free",
    description: "Convert JPG, PNG, or other images to modern WebP for faster pages. Free, nothing uploaded.",
  },
];

export function getConverter(slug: string): ConvertConfig | undefined {
  return converters.find((c) => c.slug === slug);
}
