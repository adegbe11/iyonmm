import { MetadataRoute } from "next";
import { converters } from "@/lib/converters";
import { compressTargets, resizePresets, compressPdfTargets, compressFormats, passportSpecs, guides } from "@/lib/seo-data";

const BASE = "https://iyonm.com";

const staticPages = [
  { path: "", priority: 1.0 },
  { path: "/compress-image", priority: 0.9 },
  { path: "/resize-image", priority: 0.9 },
  { path: "/remove-background", priority: 0.9 },
  { path: "/image-to-pdf", priority: 0.9 },
  { path: "/jpg-to-pdf", priority: 0.8 },
  { path: "/compress-pdf", priority: 0.9 },
  { path: "/merge-pdf", priority: 0.9 },
  { path: "/split-pdf", priority: 0.9 },
  { path: "/pdf-to-jpg", priority: 0.9 },
  { path: "/rotate-pdf", priority: 0.8 },
  { path: "/watermark-pdf", priority: 0.8 },
  { path: "/protect-pdf", priority: 0.8 },
  { path: "/unlock-pdf", priority: 0.8 },
  { path: "/ocr-pdf", priority: 0.8 },
  { path: "/remove-pages", priority: 0.8 },
  { path: "/extract-pages", priority: 0.8 },
  { path: "/word-to-pdf", priority: 0.9 },
  { path: "/excel-to-pdf", priority: 0.9 },
  { path: "/pdf-to-word", priority: 0.9 },
  { path: "/pdf-to-excel", priority: 0.9 },
  { path: "/page-numbers", priority: 0.7 },
  { path: "/pdf-to-png", priority: 0.9 },
  { path: "/pdf-reflow", priority: 0.9 },
  { path: "/pdf-to-form", priority: 0.9 },
  { path: "/ai-legal-auditor", priority: 0.9 },
  { path: "/sign-pdf", priority: 0.9 },
  { path: "/pdf-to-markdown", priority: 0.9 },
  { path: "/qr-code-generator", priority: 0.9 },
  { path: "/calculator", priority: 0.9 },
  { path: "/timer", priority: 0.8 },
  { path: "/stopwatch", priority: 0.8 },
  { path: "/percentage-calculator", priority: 0.8 },
  { path: "/age-calculator", priority: 0.8 },
  { path: "/loan-calculator", priority: 0.8 },
  { path: "/unit-converter", priority: 0.8 },
  { path: "/word-counter", priority: 0.9 },
  { path: "/json-formatter", priority: 0.9 },
  { path: "/regex-tester", priority: 0.8 },
  { path: "/env-validator", priority: 0.8 },
  { path: "/compress-video", priority: 0.9 },
  { path: "/video-to-gif", priority: 0.9 },
  { path: "/image-upscaler", priority: 0.9 },
  { path: "/ilovepdf-alternative", priority: 0.9 },
  { path: "/about", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().split("T")[0];

  const staticEntries = staticPages.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const converterEntries = converters.map((c) => ({
    url: `${BASE}/convert/${c.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const compressEntries = compressTargets.map((t) => ({
    url: `${BASE}/compress-image-to/${t.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const resizeEntries = resizePresets.map((p) => ({
    url: `${BASE}/resize-image-for/${p.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const compressPdfEntries = compressPdfTargets.map((t) => ({
    url: `${BASE}/compress-pdf-to/${t.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const compressFormatEntries = compressFormats.map((f) => ({
    url: `${BASE}/compress/${f.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const passportEntries = passportSpecs.map((p) => ({
    url: `${BASE}/passport-photo/${p.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const guideEntries = guides.map((g) => ({
    url: `${BASE}/how-to/${g.slug}`,
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...converterEntries, ...compressEntries, ...resizeEntries, ...compressPdfEntries, ...compressFormatEntries, ...passportEntries, ...guideEntries];
}
