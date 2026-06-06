"use client";

import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AudioFormat = "MP3" | "WAV" | "FLAC" | "M4A" | "AAC" | "OGG" | "OPUS";

const FORMATS: AudioFormat[] = ["MP3", "WAV", "FLAC", "M4A", "AAC", "OGG", "OPUS"];

const FORMAT_EXT: Record<AudioFormat, string> = {
  MP3: "mp3",
  WAV: "wav",
  FLAC: "flac",
  M4A: "m4a",
  AAC: "aac",
  OGG: "ogg",
  OPUS: "opus",
};

const ACCEPT = ".mp3,.wav,.flac,.m4a,.aac,.ogg,.opus";

type Status = "idle" | "loading" | "converting" | "done" | "error";

function buildFFmpegArgs(input: string, output: string, toFormat: AudioFormat, bitrate: string): string[] {
  const base = ["-i", input];

  switch (toFormat) {
    case "MP3":
      return [...base, "-b:a", `${bitrate}k`, "-f", "mp3", output];
    case "WAV":
      return [...base, "-f", "wav", output];
    case "FLAC":
      return [...base, "-f", "flac", output];
    case "M4A":
      return [...base, "-c:a", "aac", "-f", "mp4", output];
    case "AAC":
      return [...base, "-c:a", "aac", "-f", "adts", output];
    case "OGG":
      return [...base, "-c:a", "libvorbis", "-f", "ogg", output];
    case "OPUS":
      return [...base, "-c:a", "libopus", "-f", "opus", output];
  }
}

interface Props {
  defaultFrom?: AudioFormat;
  defaultTo?: AudioFormat;
}

export default function AudioConverter({ defaultFrom = "MP3", defaultTo = "MP3" }: Props) {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fromFormat, setFromFormat] = useState<AudioFormat>(defaultFrom);
  const [toFormat, setToFormat] = useState<AudioFormat>(defaultTo);
  const [bitrate, setBitrate] = useState("192");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [dragging, setDragging] = useState(false);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    const ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const handleFile = (f: File) => {
    setFile(f);
    setOutputUrl(null);
    setStatus("idle");
    setProgress(0);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const convert = async () => {
    if (!file) return;
    setStatus("loading");
    setProgress(0);
    setOutputUrl(null);

    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("converting");

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      const inputName = file.name.replace(/\s/g, "_");
      const ext = FORMAT_EXT[toFormat];
      const outName = inputName.replace(/\.[^.]+$/, "") + "." + ext;
      setOutputName(outName);

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      const args = buildFFmpegArgs(inputName, outName, toFormat, bitrate);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outName) as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: `audio/${ext}` });
      setOutputUrl(URL.createObjectURL(blob));
      setStatus("done");
      setProgress(100);
    } catch {
      setStatus("error");
    }
  };

  const busy = status === "loading" || status === "converting";

  const reset = () => {
    setFile(null);
    setOutputUrl(null);
    setOutputName("");
    setStatus("idle");
    setProgress(0);
  };

  // — Result screen —
  if (status === "done" && outputUrl) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card px-8 py-12 text-center">
        {/* Checkmark */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Ready to download</p>
          <p className="font-semibold text-foreground">{outputName}</p>
        </div>
        <a
          href={outputUrl}
          download={outputName}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-center
            bg-violet-600 text-white hover:bg-violet-500 transition-colors duration-200"
        >
          Download {toFormat}
        </a>
        <button
          onClick={reset}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Convert another file
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Format selectors */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">From</span>
          <Select value={fromFormat} onValueChange={(v) => setFromFormat(v as AudioFormat)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-muted-foreground mt-5">→</span>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">To</span>
          <Select value={toFormat} onValueChange={(v) => setToFormat(v as AudioFormat)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(toFormat === "MP3" || toFormat === "AAC") && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Quality</span>
            <Select value={bitrate} onValueChange={(v) => v && setBitrate(v)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128 kbps — Good</SelectItem>
                <SelectItem value="192">192 kbps — Better</SelectItem>
                <SelectItem value="320">320 kbps — Best</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Drop zone — large when no file, compact row when file selected */}
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <svg className="w-4 h-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
          <button
            onClick={reset}
            className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none"
            aria-label="Remove file"
          >
            ×
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-20 cursor-pointer transition-all duration-200
            ${dragging
              ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
              : "border-border hover:border-violet-400 hover:bg-violet-500/5"
            }`}
        >
          <input
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${dragging ? "bg-violet-500/20" : "bg-muted"}`}>
            <svg className={`w-7 h-7 transition-colors ${dragging ? "text-violet-400" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              {dragging ? "Drop your file here" : "Drag & drop or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{FORMATS.join(" · ")}</p>
          </div>
        </label>
      )}

      {/* Progress bar */}
      {busy && (
        <div className="flex flex-col gap-2">
          <Progress value={status === "loading" ? null : progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {status === "loading" ? "Loading engine…" : `${progress}%`}
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
      )}

      {/* Convert button */}
      <button
        onClick={convert}
        disabled={!file || busy}
        className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
          bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.99]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
      >
        {status === "loading"
          ? "Loading FFmpeg…"
          : status === "converting"
          ? `Converting… ${progress}%`
          : `Convert to ${toFormat}`}
      </button>
    </div>
  );
}
