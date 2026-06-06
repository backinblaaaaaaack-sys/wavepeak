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

type Status = "idle" | "loading" | "converting" | "done" | "error";

const ACCEPTED = ".mp3,.wav,.flac,.m4a,.aac,.ogg,.opus";
const BITRATES = ["128", "192", "320"] as const;
type Bitrate = (typeof BITRATES)[number];

export default function Converter() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<Bitrate>("192");
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

    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("converting");

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      const inputName = file.name.replace(/\s/g, "_");
      const outName = inputName.replace(/\.[^.]+$/, "") + ".mp3";
      setOutputName(outName);

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        "-i", inputName,
        "-b:a", `${bitrate}k`,
        "-f", "mp3",
        outName,
      ]);

      const data = await ffmpeg.readFile(outName) as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "audio/mpeg" });
      setOutputUrl(URL.createObjectURL(blob));
      setStatus("done");
      setProgress(100);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Drop zone */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 cursor-pointer transition-colors
          ${dragging ? "border-primary bg-accent/40" : "border-border/60 hover:border-border hover:bg-accent/20"}`}
      >
        <input
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="text-4xl text-muted-foreground">🎵</div>
        {file ? (
          <p className="text-sm font-medium text-foreground">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              Drag & drop audio file or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              MP3, WAV, FLAC, M4A, AAC, OGG, OPUS
            </p>
          </>
        )}
      </label>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-muted-foreground">Output quality</span>
          <Select value={bitrate} onValueChange={(v) => setBitrate(v as Bitrate)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="128">128 kbps</SelectItem>
              <SelectItem value="192">192 kbps</SelectItem>
              <SelectItem value="320">320 kbps (best)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={convert}
          disabled={!file || status === "loading" || status === "converting"}
          className="mt-5 px-8"
        >
          {status === "loading" ? "Loading FFmpeg…" : status === "converting" ? "Converting…" : "Convert to MP3"}
        </Button>
      </div>

      {/* Progress */}
      {(status === "loading" || status === "converting") && (
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

      {/* Download */}
      {status === "done" && outputUrl && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card px-6 py-6">
          <p className="text-sm text-muted-foreground">Conversion complete</p>
          <p className="font-medium text-foreground">{outputName}</p>
          <a
            href={outputUrl}
            download={outputName}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
}
