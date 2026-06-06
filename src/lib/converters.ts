import { type AudioFormat } from "@/components/audio-converter/AudioConverter";

export interface ConversionPair {
  from: AudioFormat;
  to: AudioFormat;
  slug: string;
  title: string;
  description: string;
}

export const CONVERSION_PAIRS: ConversionPair[] = [
  // → MP3
  { from: "FLAC", to: "MP3",  slug: "flac-to-mp3",  title: "FLAC to MP3 Converter Online Free | Wavepeak",  description: "Convert lossless FLAC audio to MP3 online for free. Up to 320 kbps, works in browser." },
  { from: "WAV",  to: "MP3",  slug: "wav-to-mp3",   title: "WAV to MP3 Converter Online Free | Wavepeak",   description: "Convert WAV files to compressed MP3 online for free. Works in browser, no upload required." },
  { from: "M4A",  to: "MP3",  slug: "m4a-to-mp3",   title: "M4A to MP3 Converter Online Free | Wavepeak",   description: "Convert M4A and Apple audio to MP3 online for free. Works in browser, no upload required." },
  { from: "OGG",  to: "MP3",  slug: "ogg-to-mp3",   title: "OGG to MP3 Converter Online Free | Wavepeak",   description: "Convert OGG Vorbis audio to MP3 online for free. Works in browser, no upload required." },
  { from: "AAC",  to: "MP3",  slug: "aac-to-mp3",   title: "AAC to MP3 Converter Online Free | Wavepeak",   description: "Convert AAC audio to MP3 online for free. Up to 320 kbps, works in browser." },
  { from: "OPUS", to: "MP3",  slug: "opus-to-mp3",  title: "OPUS to MP3 Converter Online Free | Wavepeak",  description: "Convert OPUS audio to MP3 online for free. Works in browser, no upload required." },
  // MP3 →
  { from: "MP3",  to: "WAV",  slug: "mp3-to-wav",   title: "MP3 to WAV Converter Online Free | Wavepeak",   description: "Convert MP3 to uncompressed WAV online for free. Works in browser, no upload required." },
  { from: "MP3",  to: "FLAC", slug: "mp3-to-flac",  title: "MP3 to FLAC Converter Online Free | Wavepeak",  description: "Convert MP3 to lossless FLAC format online for free. Works in browser, no upload required." },
  { from: "MP3",  to: "AAC",  slug: "mp3-to-aac",   title: "MP3 to AAC Converter Online Free | Wavepeak",   description: "Convert MP3 to AAC format online for free. Works in browser, no upload required." },
  { from: "MP3",  to: "OGG",  slug: "mp3-to-ogg",   title: "MP3 to OGG Converter Online Free | Wavepeak",   description: "Convert MP3 to OGG Vorbis format online for free. Works in browser, no upload required." },
  { from: "MP3",  to: "OPUS", slug: "mp3-to-opus",  title: "MP3 to OPUS Converter Online Free | Wavepeak",  description: "Convert MP3 to OPUS format online for free. Works in browser, no upload required." },
  { from: "MP3",  to: "M4A",  slug: "mp3-to-m4a",   title: "MP3 to M4A Converter Online Free | Wavepeak",   description: "Convert MP3 to M4A format online for free. Works in browser, no upload required." },
  // WAV →
  { from: "WAV",  to: "FLAC", slug: "wav-to-flac",  title: "WAV to FLAC Converter Online Free | Wavepeak",  description: "Convert WAV to lossless FLAC format online for free. Works in browser, no upload required." },
  { from: "WAV",  to: "AAC",  slug: "wav-to-aac",   title: "WAV to AAC Converter Online Free | Wavepeak",   description: "Convert WAV to AAC format online for free. Works in browser, no upload required." },
  // FLAC →
  { from: "FLAC", to: "WAV",  slug: "flac-to-wav",  title: "FLAC to WAV Converter Online Free | Wavepeak",  description: "Convert lossless FLAC to WAV format online for free. Works in browser, no upload required." },
  { from: "FLAC", to: "AAC",  slug: "flac-to-aac",  title: "FLAC to AAC Converter Online Free | Wavepeak",  description: "Convert lossless FLAC to AAC format online for free. Works in browser, no upload required." },
  // M4A →
  { from: "M4A",  to: "WAV",  slug: "m4a-to-wav",   title: "M4A to WAV Converter Online Free | Wavepeak",   description: "Convert M4A to WAV format online for free. Works in browser, no upload required." },
  { from: "M4A",  to: "FLAC", slug: "m4a-to-flac",  title: "M4A to FLAC Converter Online Free | Wavepeak",  description: "Convert M4A to lossless FLAC format online for free. Works in browser, no upload required." },
  // AAC →
  { from: "AAC",  to: "WAV",  slug: "aac-to-wav",   title: "AAC to WAV Converter Online Free | Wavepeak",   description: "Convert AAC to WAV format online for free. Works in browser, no upload required." },
  { from: "AAC",  to: "FLAC", slug: "aac-to-flac",  title: "AAC to FLAC Converter Online Free | Wavepeak",  description: "Convert AAC to lossless FLAC format online for free. Works in browser, no upload required." },
  // OGG →
  { from: "OGG",  to: "WAV",  slug: "ogg-to-wav",   title: "OGG to WAV Converter Online Free | Wavepeak",   description: "Convert OGG Vorbis to WAV format online for free. Works in browser, no upload required." },
  { from: "OGG",  to: "FLAC", slug: "ogg-to-flac",  title: "OGG to FLAC Converter Online Free | Wavepeak",  description: "Convert OGG Vorbis to lossless FLAC format online for free. Works in browser, no upload required." },
];
