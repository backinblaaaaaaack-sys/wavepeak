"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Progress } from "@/components/ui/progress";

const ACCEPT = ".mp3,.wav,.flac,.m4a,.aac,.ogg,.opus";
type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";
type DragTarget = "start" | "end" | null;

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function extractPeaks(buffer: AudioBuffer, count: number): Float32Array {
  const data = buffer.getChannelData(0);
  const blockSize = Math.floor(data.length / count);
  const peaks = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    let max = 0;
    const start = i * blockSize;
    for (let j = 0; j < blockSize; j++) {
      const v = Math.abs(data[start + j]);
      if (v > max) max = v;
    }
    peaks[i] = max;
  }
  return peaks;
}

function drawCanvas(
  canvas: HTMLCanvasElement,
  peaks: Float32Array,
  startRatio: number,
  endRatio: number,
  playRatio: number | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const mid = H / 2;
  const barW = 2;
  const gap = 1;
  const step = barW + gap;
  const count = Math.floor(W / step);

  // Draw bars
  for (let i = 0; i < count; i++) {
    const ratio = i / count;
    const peakIdx = Math.floor(ratio * peaks.length);
    const amp = peaks[peakIdx] * mid * 0.85;
    const x = i * step;
    const inRange = ratio >= startRatio && ratio <= endRatio;
    ctx.fillStyle = inRange ? "#7c3aed" : "#52525b";
    ctx.fillRect(x, mid - amp, barW, amp * 2 || 1);
  }

  // Darken outside selection
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, startRatio * W, H);
  ctx.fillRect(endRatio * W, 0, W - endRatio * W, H);

  // Playhead
  if (playRatio !== null) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(playRatio * W, 0);
    ctx.lineTo(playRatio * W, H);
    ctx.stroke();
  }
}

export default function AudioCutter() {
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peaksRef = useRef<Float32Array | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const playStartWallRef = useRef<number>(0);
  const playOffsetRef = useRef<number>(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<DragTarget>(null);

  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [playRatio, setPlayRatio] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [dragging, setDragging] = useState(false); // drop zone drag

  // Redraw canvas whenever selection or playhead changes
  const redraw = useCallback((start: number, end: number, dur: number, pRatio: number | null) => {
    const canvas = canvasRef.current;
    const peaks = peaksRef.current;
    if (!canvas || !peaks || dur === 0) return;
    drawCanvas(canvas, peaks, start / dur, end / dur, pRatio);
  }, []);

  useEffect(() => {
    redraw(startTime, endTime, duration, playRatio);
  }, [startTime, endTime, duration, playRatio, redraw]);

  // Stop playback helper
  const stopPlayback = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
    setIsPlaying(false);
    setPlayRatio(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { stopPlayback(); }, [stopPlayback]);

  const loadFile = useCallback(async (f: File) => {
    stopPlayback();
    setFile(f);
    setStatus("idle");
    setOutputUrl(null);
    setProgress(0);

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

    setDuration(dur);
    setStartTime(0);
    setEndTime(dur);
    setPlayRatio(null);

    if (canvas) drawCanvas(canvas, peaks, 0, 1, null);
  }, [stopPlayback]);

  const onFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  // Play / Pause
  const togglePlay = useCallback(() => {
    if (isPlaying) { stopPlayback(); return; }

    const audioBuffer = audioBufferRef.current;
    const audioCtx = audioCtxRef.current;
    if (!audioBuffer || !audioCtx) return;

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const segmentDuration = endTime - startTime;
    playStartWallRef.current = audioCtx.currentTime;
    playOffsetRef.current = startTime;

    source.start(0, startTime, segmentDuration);
    sourceRef.current = source;
    setIsPlaying(true);

    // Animate playhead
    const tick = () => {
      const elapsed = audioCtx.currentTime - playStartWallRef.current;
      const currentPos = playOffsetRef.current + elapsed;

      if (currentPos >= endTime) {
        stopPlayback();
        return;
      }
      setPlayRatio(currentPos / duration);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    source.onended = () => { stopPlayback(); };
  }, [isPlaying, startTime, endTime, duration, stopPlayback]);

  // Drag handle logic
  const ratioFromMouseX = (clientX: number): number => {
    const overlay = overlayRef.current;
    if (!overlay) return 0;
    const rect = overlay.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const onHandleMouseDown = (target: DragTarget) => (e: React.MouseEvent) => {
    e.preventDefault();
    dragTargetRef.current = target;
  };

  const onOverlayMouseMove = useCallback((e: React.MouseEvent) => {
    const target = dragTargetRef.current;
    if (!target || duration === 0) return;
    const ratio = ratioFromMouseX(e.clientX);
    const t = ratio * duration;
    if (target === "start") {
      setStartTime(Math.min(t, endTime - 0.1));
    } else {
      setEndTime(Math.max(t, startTime + 0.1));
    }
  }, [duration, startTime, endTime]);

  const onOverlayMouseUp = useCallback(() => {
    dragTargetRef.current = null;
  }, []);

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

  const cut = async () => {
    if (!file) return;
    stopPlayback();
    setStatus("loading-ffmpeg");
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("converting");
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));

      const inputName = file.name.replace(/\s/g, "_");
      const ext = inputName.split(".").pop() ?? "mp3";
      const outName = inputName.replace(/\.[^.]+$/, "") + `_cut.${ext}`;
      setOutputName(outName);

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-ss", startTime.toFixed(3), "-to", endTime.toFixed(3), "-i", inputName, outName]);

      const data = await ffmpeg.readFile(outName) as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: file.type });
      setOutputUrl(URL.createObjectURL(blob));
      setStatus("done");
      setProgress(100);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    stopPlayback();
    setFile(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setPlayRatio(null);
    setStatus("idle");
    setOutputUrl(null);
    setOutputName("");
    setProgress(0);
    peaksRef.current = null;
    audioBufferRef.current = null;
  };

  const busy = status === "loading-ffmpeg" || status === "converting";

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
          <p className="text-sm text-muted-foreground mb-1">Ready to download</p>
          <p className="font-semibold text-foreground">{outputName}</p>
          <p className="text-xs text-muted-foreground mt-1">{fmt(startTime)} → {fmt(endTime)}</p>
        </div>
        <a
          href={outputUrl}
          download={outputName}
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-center bg-violet-600 text-white hover:bg-violet-500 transition-colors duration-200"
        >
          Download
        </a>
        <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Cut another file
        </button>
      </div>
    );
  }

  // — Editor —
  if (file && duration > 0) {
    const startPct = (startTime / duration) * 100;
    const endPct = (endTime / duration) * 100;

    return (
      <div className="flex flex-col gap-4">
        {/* Compact file row */}
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <svg className="w-4 h-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">{fmt(duration)}</span>
          <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none ml-1" aria-label="Remove">×</button>
        </div>

        {/* Waveform + handles */}
        <div className="relative rounded-xl overflow-visible border border-border/60 bg-zinc-900 select-none">
          <canvas ref={canvasRef} width={640} height={96} className="w-full h-24 block" />

          {/* Drag overlay — captures mouse move/up */}
          <div
            ref={overlayRef}
            className="absolute inset-0"
            onMouseMove={onOverlayMouseMove}
            onMouseUp={onOverlayMouseUp}
            onMouseLeave={onOverlayMouseUp}
          />

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

        {/* Timecodes */}
        <div className="flex justify-between px-0.5">
          <span className="text-xs font-mono text-violet-400">{fmt(startTime)}</span>
          <span className="text-xs text-muted-foreground">
            {fmt(endTime - startTime)} selected
          </span>
          <span className="text-xs font-mono text-violet-400">{fmt(endTime)}</span>
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border/60 bg-card text-sm font-medium text-foreground hover:bg-accent/40 transition-colors"
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play selection
            </>
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

        {/* Error */}
        {status === "error" && (
          <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
        )}

        {/* Cut button */}
        <button
          onClick={cut}
          disabled={busy}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
            bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.99]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
        >
          {status === "loading-ffmpeg"
            ? "Loading FFmpeg…"
            : status === "converting"
            ? `Cutting… ${progress}%`
            : `Cut  ${fmt(startTime)} → ${fmt(endTime)}`}
        </button>
      </div>
    );
  }

  // — Drop zone —
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onFileDrop}
      className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-20 cursor-pointer transition-all duration-200
        ${dragging ? "border-violet-500 bg-violet-500/10 scale-[1.01]" : "border-border hover:border-violet-400 hover:bg-violet-500/5"}`}
    >
      <input type="file" accept={ACCEPT} className="hidden" onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
      <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${dragging ? "bg-violet-500/20" : "bg-muted"}`}>
        <svg className={`w-7 h-7 transition-colors ${dragging ? "text-violet-400" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-foreground">
          {dragging ? "Drop your file here" : "Drag & drop or click to browse"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">MP3 · WAV · FLAC · M4A · AAC · OGG · OPUS</p>
      </div>
    </label>
  );
}
