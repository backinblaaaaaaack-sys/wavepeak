import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/m4a-to-mp3' },
  title: "M4A to MP3 Converter Online Free | Wavepeak",
  description: "Convert M4A to MP3 online for free. Choose quality up to 320 kbps. Works in your browser — no upload, no server.",
  openGraph: {
    title: "M4A to MP3 Converter Online Free | Wavepeak",
    description: "Convert M4A to MP3 online. Up to 320 kbps, works in browser, no upload required.",
    url: "https://wavepeak.app/m4a-to-mp3",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="M4A to MP3 Converter"
      description="Convert M4A and Apple audio formats to universal MP3 — right in your browser. No upload, no server."
      defaultFrom="M4A"
      defaultTo="MP3"
    />
  );
}
