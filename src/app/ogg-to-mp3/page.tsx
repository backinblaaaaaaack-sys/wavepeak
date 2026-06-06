import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/ogg-to-mp3' },
  title: "OGG to MP3 Converter Online Free | Wavepeak",
  description: "Convert OGG to MP3 online for free. Choose quality up to 320 kbps. Works in your browser — no upload, no server.",
  openGraph: {
    title: "OGG to MP3 Converter Online Free | Wavepeak",
    description: "Convert OGG to MP3 online. Up to 320 kbps, works in browser, no upload required.",
    url: "https://wavepeak-iota.vercel.app/ogg-to-mp3",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="OGG to MP3 Converter"
      description="Convert OGG Vorbis audio to MP3 — right in your browser. No upload, no server."
      defaultFrom="OGG"
      defaultTo="MP3"
    />
  );
}
