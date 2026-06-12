import { MetadataRoute } from "next";

const SITE = "https://www.iyonm.com";

// Explicitly allow the major AI crawlers so IYONM is eligible to be cited in
// ChatGPT, Perplexity, Google AI Overviews, Claude, etc. (many sites block these).
const aiBots = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web",
  "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended",
  "Applebot-Extended", "Amazonbot", "Bytespider", "CCBot", "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
