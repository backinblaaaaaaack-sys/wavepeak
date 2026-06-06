import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "M4A to WAV Converter Online Free | Wavepeak",
  description: "Convert M4A to WAV online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "M4A to WAV Converter Online Free | Wavepeak",
    description: "Convert M4A to WAV online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/m4a-to-wav",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="M4A to WAV Converter"
      description="Convert M4A to WAV — right in your browser. No upload, no server."
      defaultFrom="M4A"
      defaultTo="WAV"
    />
  );
}
