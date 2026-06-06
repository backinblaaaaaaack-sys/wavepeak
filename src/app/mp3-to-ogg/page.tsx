import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/mp3-to-ogg' },
  title: "MP3 to OGG Converter Online Free | Wavepeak",
  description: "Convert MP3 to OGG online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "MP3 to OGG Converter Online Free | Wavepeak",
    description: "Convert MP3 to OGG online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/mp3-to-ogg",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="MP3 to OGG Converter"
      description="Convert MP3 to OGG — right in your browser. No upload, no server."
      defaultFrom="MP3"
      defaultTo="OGG"
    />
  );
}
