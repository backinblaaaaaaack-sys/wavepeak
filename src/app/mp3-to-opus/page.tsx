import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "MP3 to OPUS Converter Online Free | Wavepeak",
  description: "Convert MP3 to OPUS online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "MP3 to OPUS Converter Online Free | Wavepeak",
    description: "Convert MP3 to OPUS online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/mp3-to-opus",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="MP3 to OPUS Converter"
      description="Convert MP3 to OPUS — right in your browser. No upload, no server."
      defaultFrom="MP3"
      defaultTo="OPUS"
    />
  );
}
