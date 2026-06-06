import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "MP3 to WAV Converter Online Free | Wavepeak",
  description: "Convert MP3 to WAV online for free. Lossless output, works in your browser — no upload, no server.",
  openGraph: {
    title: "MP3 to WAV Converter Online Free | Wavepeak",
    description: "Convert MP3 to WAV online. Lossless output, works in browser, no upload required.",
    url: "https://wavepeak-iota.vercel.app/mp3-to-wav",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="MP3 to WAV Converter"
      description="Convert MP3 to uncompressed WAV format — right in your browser. No upload, no server."
      defaultFrom="MP3"
      defaultTo="WAV"
    />
  );
}
