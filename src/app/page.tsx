import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PopularConversions from "@/components/popular-conversions/PopularConversions";

export const metadata: Metadata = {
  alternates: { canonical: "https://wavepeak-iota.vercel.app" },
};

const tools = [
  {
    title: "MP3 Converter",
    description: "Convert any audio file to MP3 format quickly and easily.",
    badge: "Popular",
    href: "/mp3-converter",
  },
  {
    title: "Audio Cutter",
    description: "Trim and cut your audio files to the exact length you need.",
    badge: null,
    href: "/audio-cutter",
  },
  {
    title: "Ringtone Maker",
    description: "Create custom ringtones from any song or audio clip.",
    badge: null,
    href: "/ringtone-maker",
  },
  {
    title: "Volume Booster",
    description: "Increase the volume of your audio files without quality loss.",
    badge: null,
    href: "/volume-booster",
  },
  {
    title: "WAV to MP3",
    description: "Convert WAV files to compressed MP3 format instantly.",
    badge: null,
    href: "/wav-to-mp3",
  },
  {
    title: "FLAC to MP3",
    description: "Convert lossless FLAC audio to lightweight MP3.",
    badge: null,
    href: "/flac-to-mp3",
  },
  {
    title: "M4A to MP3",
    description: "Convert M4A and Apple audio formats to universal MP3.",
    badge: null,
    href: "/m4a-to-mp3",
  },
  {
    title: "Audio Merger",
    description: "Combine multiple audio files into one seamless track.",
    badge: null,
    href: "/audio-merger",
  },
  {
    title: "Audio Speed Changer",
    description: "Speed up or slow down audio without changing the pitch.",
    badge: null,
    href: "/audio-speed-changer",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Wave<span className="text-muted-foreground">peak</span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Free Online Audio Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Convert, cut, merge and enhance your audio files — all in the browser, no upload required.
          </p>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <Card className="group relative cursor-pointer border-border/60 bg-card hover:border-border transition-colors duration-200 hover:bg-accent/30 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold text-card-foreground group-hover:text-foreground transition-colors">
                      {tool.title}
                    </CardTitle>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Popular Conversions */}
      <div className="border-t border-border/50">
        <PopularConversions />
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
