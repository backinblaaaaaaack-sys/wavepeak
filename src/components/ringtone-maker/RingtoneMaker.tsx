"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Progress } from "@/components/ui/progress";
import { fmt, extractPeaks, drawCanvas } from "@/lib/waveform";

const ACCEPT = ".mp3,.wav,.flac,.m4a,.aac,.ogg,.opus";
const MAX_SEC = 40;
type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";

interface OutputUrls {
  m4r: string;
  mp3: string;
  baseName: string;
}

export default function RingtoneMaker() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const peaksRef = useRef<Float32Array | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const playStartWallRef = useRef<number>(0);
  const playOffsetRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const endTimeRef = useRef(0);
  const durationRef = useRef(0);

  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [playRatio, setPlayRatio] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMaxHint, setShowMaxHint] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrls, setOutputUrls] = useState<OutputUrls | null>(null);
  const [dropDragging, setDropDragging] = useState(false);

  // Redraw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const peaks = peaksRef.current;
    if (!canvas || !peaks || duration === 0) return;
    drawCanvas(canvas, peaks, startTime / duration, endTime / duration, playRatio);
  }, [startTime, endTime, duration, playRatio]);

  // Stop playback
  const stopPlayback = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
    setIsPlaying(false);
    setPlayRatio(null);
  }, []);

  useEffect(() => () => { stopPlayback(); }, [stopPlayback]);

  // Load file
  const loadFile = useCallback(async (f: File) => {
    stopPlayback();
    setFile(f);
    setStatus("idle");
    setOutputUrls(null);
    setProgress(0);
    setShowMaxHint(false);

    const arrayBuffer = await f.arrayBuffer();
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer.slice(0));
    audioBufferRef.current = audioBuffer;

    const dur = audioBuffer.duration;
    const canvas = canvasRef.current;
    const peakCount = canvas ? Math.floor(canvas.width / 3) : 400;
    const peaks = extractPeaks(audioBuffer, peakCount);
    peaksRef.current = peaks;

    const initialEnd = Math.min(dur, MAX_SEC);
    durationRef.current = dur;  setDuration(dur);
    startTimeRef.current = 0;   setStartTime(0);
    endTimeRef.current = initialEnd; setEndTime(initialEnd);
    setPlayRatio(null);

    if (canvas) drawCanvas(canvas, peaks, 0, initialEnd / dur, null);
  }, [stopPlayback]);

  const onFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  // Show max hint briefly
  const triggerMaxHint = useCallback(() => {
    setShowMaxHint(true);
    setTimeout(() => setShowMaxHint(false), 2000);
  }, []);

  // Drag handles — window listeners, 40s limit
  const onHandleMouseDown = (target: "start" | "end") => (e: React.MouseEvent) => {
    e.preventDefault();

    const onMove = (ev: MouseEvent) => {
      const overlay = overlayRef.current;
      const dur = durationRef.current;
      if (!overlay || dur === 0) return;
      const rect = overlay.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const t = ratio * dur;

      if (target === "start") {
        // start can't push selection over MAX_SEC
        const maxStart = endTimeRef.current - 0.1;
        const minStart = Math.max(0, endTimeRef.current - MAX_SEC);
        const v = Math.max(minStart, Math.min(t, maxStart));
        if (t < minStart) triggerMaxHint();
        startTimeRef.current = v;
        setStartTime(v);
      } else {
        // end can't go beyond start + MAX_SEC
        const minEnd = startTimeRef.current + 0.1;
        const maxEnd = Math.min(dur, startTimeRef.current + MAX_SEC);
        const v = Math.max(minEnd, Math.min(t, maxEnd));
        if (t > maxEnd) triggerMaxHint();
        endTimeRef.current = v;
        setEndTime(v);
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Play / Pause
  const togglePlay = useCallback(() => {
    if (isPlaying) { stopPlayback(); return; }
    const audioBuffer = audioBufferRef.current;
    const audioCtx = audioCtxRef.current;
    if (!audioBuffer || !audioCtx) return;

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const segDur = endTime - startTime;
    playStartWallRef.current = audioCtx.currentTime;
    playOffsetRef.current = startTime;
    source.start(0, startTime, segDur);
    sourceRef.current = source;
    setIsPlaying(true);

    const tick = () => {
      const elapsed = audioCtx.currentTime - playStartWallRef.current;
      const pos = playOffsetRef.current + elapsed;
      if (pos >= endTime) { stopPlayback(); return; }
      setPlayRatio(pos / duration);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    source.onended = () => stopPlayback();
  }, [isPlaying, startTime, endTime, duration, stopPlayback]);

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

  const createRingtone = async () => {
    if (!file) return;
    stopPlayback();
    setStatus("loading-ffmpeg");
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("converting");

      const inputName = file.name.replace(/\s/g, "_");
      const baseName = inputName.replace(/\.[^.]+$/, "");
      const ssArg = startTime.toFixed(3);
      const toArg = endTime.toFixed(3);

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // M4R for iPhone (AAC in mp4 container, .m4r extension)
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 50)));
      await ffmpeg.exec(["-ss", ssArg, "-to", toArg, "-i", inputName, "-c:a", "aac", "-f", "mp4", `${baseName}.m4r`]);

      // MP3 for Android
      ffmpeg.on("progress", ({ progress: p }) => setProgress(50 + Math.round(p * 50)));
      await ffmpeg.exec(["-ss", ssArg, "-to", toArg, "-i", inputName, `${baseName}_ringtone.mp3`]);

      const m4rData = await ffmpeg.readFile(`${baseName}.m4r`) as Uint8Array;
      const mp3Data = await ffmpeg.readFile(`${baseName}_ringtone.mp3`) as Uint8Array;

      setOutputUrls({
        m4r: URL.createObjectURL(new Blob([m4rData.buffer as ArrayBuffer], { type: "audio/mp4" })),
        mp3: URL.createObjectURL(new Blob([mp3Data.buffer as ArrayBuffer], { type: "audio/mpeg" })),
        baseName,
      });
      setStatus("done");
      setProgress(100);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    stopPlayback();
    setFile(null);
    durationRef.current = 0; setDuration(0);
    startTimeRef.current = 0; setStartTime(0);
    endTimeRef.current = 0;  setEndTime(0);
    setPlayRatio(null);
    setStatus("idle");
    setOutputUrls(null);
    setProgress(0);
    setShowMaxHint(false);
    peaksRef.current = null;
    audioBufferRef.current = null;
  };

  const busy = status === "loading-ffmpeg" || status === "converting";

  // — Result screen —
  if (status === "done" && outputUrls) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card px-8 py-12 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Your ringtone is ready</p>
          <p className="font-semibold text-foreground">{outputUrls.baseName}</p>
          <p className="text-xs text-muted-foreground mt-1">{fmt(startTime)} → {fmt(endTime)} · {fmt(endTime - startTime)}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <a
            href={outputUrls.m4r}
            download={`${outputUrls.baseName}.m4r`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold
              bg-violet-600 text-white hover:bg-violet-500 transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.07c1.28.13 2.16.73 3.01.75.61-.12 1.5-.73 2.97-.62 1.68.13 2.94.73 3.77 1.81-3.45 2.07-2.89 6.55.65 7.93-.75 1.84-1.72 3.64-2.4 4.34zM12.03 7.02c-.15-2.23 1.66-4.07 3.74-4.02.29 2.58-2.34 4.5-3.74 4.02z"/></svg>
            Download for iPhone (.m4r)
          </a>
          <a
            href={outputUrls.mp3}
            download={`${outputUrls.baseName}_ringtone.mp3`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold
              border border-border/60 bg-card text-foreground hover:bg-accent/40 transition-colors duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993-.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993-.0001.5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 0 0-.1521-.5676.416.416 0 0 0-.5676.1521l-2.0223 3.503C15.5902 8.6 14.3509 8.3 13.0 8.3c-1.3509 0-2.5902.3-3.6419.7869L7.2958 5.5843a.4161.4161 0 0 0-.5677-.1521.4157.4157 0 0 0-.1521.5676l1.9973 3.4592C6.5 10.5 5.4 12.1 5.4 14h13.2c0-1.9-1.1-3.5-2.7226-4.6786"/></svg>
            Download for Android (.mp3)
          </a>
        </div>
        <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Make another ringtone
        </button>
      </div>
    );
  }

  // — Editor —
  if (file && duration > 0) {
    const startPct = (startTime / duration) * 100;
    const endPct = (endTime / duration) * 100;
    const selSec = endTime - startTime;

    return (
      <div className="flex flex-col gap-4">
        {/* File row */}
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <svg className="w-4 h-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">{fmt(duration)}</span>
          <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none ml-1" aria-label="Remove">×</button>
        </div>

        {/* Waveform */}
        <div className="relative rounded-xl overflow-visible border border-border/60 bg-zinc-900 select-none">
          <canvas ref={canvasRef} width={640} height={96} className="w-full h-24 block" />
          <div ref={overlayRef} className="absolute inset-0 pointer-events-none" />

          {/* Start handle */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center z-10"
            style={{ left: `${startPct}%`, transform: "translateX(-50%)", cursor: "grab" }}
            onMouseDown={onHandleMouseDown("start")}
          >
            <div className="w-3 bg-white/95 rounded-sm flex items-center justify-center shadow-md shadow-black/40" style={{ height: "calc(100% + 16px)" }}>
              <div className="flex gap-0.5">
                <div className="w-px h-4 bg-zinc-400 rounded-full" />
                <div className="w-px h-4 bg-zinc-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* End handle */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center z-10"
            style={{ left: `${endPct}%`, transform: "translateX(-50%)", cursor: "grab" }}
            onMouseDown={onHandleMouseDown("end")}
          >
            <div className="w-3 bg-white/95 rounded-sm flex items-center justify-center shadow-md shadow-black/40" style={{ height: "calc(100% + 16px)" }}>
              <div className="flex gap-0.5">
                <div className="w-px h-4 bg-zinc-400 rounded-full" />
                <div className="w-px h-4 bg-zinc-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Timecodes + max hint */}
        <div className="flex justify-between items-center px-0.5">
          <span className="text-xs font-mono text-violet-400">{fmt(startTime)}</span>
          <span className={`text-xs transition-colors ${selSec >= MAX_SEC ? "text-amber-400 font-medium" : "text-muted-foreground"}`}>
            {showMaxHint ? "40 sec max for ringtones" : `${fmt(selSec)} selected`}
          </span>
          <span className="text-xs font-mono text-violet-400">{fmt(endTime)}</span>
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-accent/40 transition-colors"
        >
          {isPlaying ? (
            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>Pause</>
          ) : (
            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Play selection</>
          )}
        </button>

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

        {/* Create button */}
        <button
          onClick={createRingtone}
          disabled={busy}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
            bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.99]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
        >
          {status === "loading-ffmpeg"
            ? "Loading FFmpeg…"
            : status === "converting"
            ? `Creating… ${progress}%`
            : `Create Ringtone  ${fmt(startTime)} → ${fmt(endTime)}`}
        </button>
      </div>
    );
  }

  // — Drop zone —
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDropDragging(true); }}
      onDragLeave={() => setDropDragging(false)}
      onDrop={onFileDrop}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-20 cursor-pointer transition-all duration-200
        ${dropDragging ? "border-violet-500 bg-violet-500/10 scale-[1.01]" : "border-border hover:border-violet-400 hover:bg-violet-500/5"}`}
    >
      <input type="file" accept={ACCEPT} className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${dropDragging ? "bg-violet-500/20" : "bg-muted"}`}>
        <svg className={`w-7 h-7 transition-colors ${dropDragging ? "text-violet-400" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">
          {dropDragging ? "Drop your file here" : "Drag & drop or click to browse"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">MP3 · WAV · FLAC · M4A · AAC · OGG · OPUS</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Max 40 seconds for ringtones</p>
      </div>
    </label>
  );
}
