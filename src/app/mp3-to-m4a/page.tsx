import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/mp3-to-m4a' },
  title: "MP3 to M4A Converter Online Free | Wavepeak",
  description: "Convert MP3 to M4A online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "MP3 to M4A Converter Online Free | Wavepeak",
    description: "Convert MP3 to M4A online for free. No upload required.",
    url: "https://wavepeak.app/mp3-to-m4a",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="MP3 to M4A Converter"
      description="Convert MP3 to M4A — right in your browser. No upload, no server."
      defaultFrom="MP3"
      defaultTo="M4A"
    />
  );
}
