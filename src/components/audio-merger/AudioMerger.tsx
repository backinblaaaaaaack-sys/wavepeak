"use client";

import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Progress } from "@/components/ui/progress";

const ACCEPT = ".mp3,.wav,.flac,.m4a,.aac,.ogg,.opus";
type Status = "idle" | "loading-ffmpeg" | "merging" | "done" | "error";

interface FileItem {
  id: string;
  file: File;
}

let idCounter = 0;
const newId = () => `f${++idCounter}`;

export default function AudioMerger() {
  const ffmpegRef   = useRef<FFmpeg | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const [files, setFiles]         = useState<FileItem[]>([]);
  const [status, setStatus]       = useState<Status>("idle");
  const [progress, setProgress]   = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [dropDragging, setDropDragging] = useState(false);
  const [dragOverIdx, setDragOverIdx]   = useState<number | null>(null);

  // Add files (dedup by name+size)
  const addFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name + f.file.size));
      const fresh = incoming
        .filter((f) => !existing.has(f.name + f.size))
        .map((f) => ({ id: newId(), file: f }));
      return [...prev, ...fresh];
    });
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  // Zone drop
  const onZoneDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  // List drag-to-reorder
  const onDragStart = (idx: number) => { dragIndexRef.current = idx; };

  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const onDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const from = dragIndexRef.current;
    if (from === null || from === targetIdx) { setDragOverIdx(null); return; }
    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(targetIdx, 0, item);
      return arr;
    });
    dragIndexRef.current = null;
    setDragOverIdx(null);
  };

  const onDragEnd = () => { dragIndexRef.current = null; setDragOverIdx(null); };

  // FFmpeg
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

  const merge = async () => {
    if (files.length < 2) return;
    setStatus("loading-ffmpeg");
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("merging");
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));

      // Write all input files
      const inputNames: string[] = [];
      for (const { file } of files) {
        const name = file.name.replace(/\s/g, "_");
        inputNames.push(name);
        await ffmpeg.writeFile(name, await fetchFile(file));
      }

      // Build filter_complex: [0:a][1:a]...[n:a]concat=n=N:v=0:a=1[out]
      const n = inputNames.length;
      const inputs = inputNames.map((_, i) => `-i`).flatMap((flag, i) => [flag, inputNames[i]]);
      const filterInputs = Array.from({ length: n }, (_, i) => `[${i}:a]`).join("");
      const filterComplex = `${filterInputs}concat=n=${n}:v=0:a=1[out]`;
      const outName = "merged.mp3";
      setOutputName(outName);

      await ffmpeg.exec([
        ...inputs,
        "-filter_complex", filterComplex,
        "-map", "[out]",
        "-b:a", "192k",
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

  const reset = () => {
    setFiles([]);
    setStatus("idle");
    setOutputUrl(null);
    setOutputName("");
    setProgress(0);
  };

  const busy = status === "loading-ffmpeg" || status === "merging";
  const fmt = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  // — Result screen —
  if (status === "done" && outputUrl) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card px-8 py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{files.length} files merged</p>
          <p className="font-semibold text-foreground">{outputName}</p>
        </div>
        <a
          href={outputUrl}
          download={outputName}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-center
            bg-violet-600 text-white hover:bg-violet-500 transition-colors duration-200"
        >
          Download
        </a>
        <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Merge another set
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Drop zone — always visible if < 2 files, or as add-more area */}
      {files.length === 0 ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDropDragging(true); }}
          onDragLeave={() => setDropDragging(false)}
          onDrop={onZoneDrop}
          className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-20 cursor-pointer transition-all duration-200
            ${dropDragging ? "border-violet-500 bg-violet-500/10 scale-[1.01]" : "border-border hover:border-violet-400 hover:bg-violet-500/5"}`}
        >
          <input type="file" accept={ACCEPT} multiple className="hidden"
            onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} />
          <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${dropDragging ? "bg-violet-500/20" : "bg-muted"}`}>
            <svg className={`w-7 h-7 ${dropDragging ? "text-violet-400" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              {dropDragging ? "Drop files here" : "Drag & drop files or click to browse"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Select 2 or more · MP3 · WAV · FLAC · M4A · AAC · OGG · OPUS</p>
          </div>
        </label>
      ) : (
        <>
          {/* File list */}
          <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-card overflow-hidden">
            {files.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={(e) => onDragOver(e, idx)}
                onDrop={(e) => onDrop(e, idx)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-grab
                  ${dragOverIdx === idx ? "bg-violet-500/10 border-l-2 border-violet-500" : "hover:bg-accent/20 border-l-2 border-transparent"}`}
              >
                {/* Drag handle */}
                <svg className="w-4 h-4 shrink-0 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                </svg>
                {/* Index */}
                <span className="text-xs text-muted-foreground/60 w-4 shrink-0 text-center">{idx + 1}</span>
                {/* Music icon */}
                <svg className="w-4 h-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <span className="flex-1 text-sm text-foreground truncate">{item.file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{fmt(item.file.size)}</span>
                <button onClick={() => removeFile(item.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none ml-1 shrink-0"
                  aria-label="Remove">×</button>
              </div>
            ))}
          </div>

          {/* Add more files */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDropDragging(true); }}
            onDragLeave={() => setDropDragging(false)}
            onDrop={onZoneDrop}
            className={`flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 cursor-pointer text-sm transition-colors
              ${dropDragging ? "border-violet-500 bg-violet-500/10 text-violet-400" : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"}`}
          >
            <input type="file" accept={ACCEPT} multiple className="hidden"
              onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} />
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add more files
          </label>

          {/* Progress */}
          {busy && (
            <div className="flex flex-col gap-2">
              <Progress value={status === "loading-ffmpeg" ? null : progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {status === "loading-ffmpeg" ? "Loading engine…" : `${progress}%`}
              </p>
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
          )}

          {/* Merge button */}
          <button
            onClick={merge}
            disabled={files.length < 2 || busy}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
              bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.99]
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
          >
            {status === "loading-ffmpeg"
              ? "Loading FFmpeg…"
              : status === "merging"
              ? `Merging… ${progress}%`
              : files.length < 2
              ? "Add at least 2 files"
              : `Merge ${files.length} files`}
          </button>
        </>
      )}
    </div>
  );
}
