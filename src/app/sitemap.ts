import { type MetadataRoute } from "next";
import { CONVERSION_PAIRS } from "@/lib/converters";

const BASE = "https://wavepeak-iota.vercel.app";

const TOOLS = [
  "/audio-converter",
  "/audio-cutter",
  "/ringtone-maker",
  "/volume-booster",
  "/audio-merger",
  "/audio-speed-changer",
  "/mp3-converter",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Homepage
  const home: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Main tools
  const tools: MetadataRoute.Sitemap = TOOLS.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  // Converter pairs
  const conversions: MetadataRoute.Sitemap = CONVERSION_PAIRS.map((pair) => ({
    url: `${BASE}/${pair.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...home, ...tools, ...conversions];
}
