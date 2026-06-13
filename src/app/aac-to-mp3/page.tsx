import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/aac-to-mp3' },
  title: "AAC to MP3 Converter Online Free | Wavepeak",
  description: "Convert AAC to MP3 online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "AAC to MP3 Converter Online Free | Wavepeak",
    description: "Convert AAC to MP3 online for free. No upload required.",
    url: "https://wavepeak.app/aac-to-mp3",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="AAC to MP3 Converter"
      description="Convert AAC to MP3 — right in your browser. No upload, no server."
      defaultFrom="AAC"
      defaultTo="MP3"
    />
  );
}
