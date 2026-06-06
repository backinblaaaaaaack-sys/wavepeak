import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "OPUS to MP3 Converter Online Free | Wavepeak",
  description: "Convert OPUS to MP3 online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "OPUS to MP3 Converter Online Free | Wavepeak",
    description: "Convert OPUS to MP3 online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/opus-to-mp3",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="OPUS to MP3 Converter"
      description="Convert OPUS to MP3 — right in your browser. No upload, no server."
      defaultFrom="OPUS"
      defaultTo="MP3"
    />
  );
}
