"use client";

import { useRef, useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { Progress } from "@/components/ui/progress";

const ACCEPT = ".mp3,.wav,.flac,.m4a,.aac,.ogg,.opus";
const MIN_VOL = 100;
const MAX_VOL = 500;
const DEFAULT_VOL = 200;
const STEP = 10;

type Status = "idle" | "loading-ffmpeg" | "boosting" | "done" | "error";

function getHint(vol: number): { text: string; color: string } {
  if (vol <= 200) return { text: "Safe boost",                  color: "text-green-400" };
  if (vol <= 350) return { text: "Loud, possible distortion",   color: "text-yellow-400" };
  return               { text: "Warning: may clip",             color: "text-red-400" };
}

export default function VolumeBooster() {
  const ffmpegRef    = useRef<FFmpeg | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const sourceRef    = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef  = useRef<GainNode | null>(null);
  const audioDataRef = useRef<ArrayBuffer | null>(null);

  const [file, setFile]               = useState<File | null>(null);
  const [volume, setVolume]           = useState(DEFAULT_VOL);
  const [status, setStatus]           = useState<Status>("idle");
  const [progress, setProgress]       = useState(0);
  const [outputUrl, setOutputUrl]     = useState<string | null>(null);
  const [outputName, setOutputName]   = useState("");
  const [dropDragging, setDropDragging] = useState(false);
  const [isPlaying, setIsPlaying]     = useState(false);

  const stopPlayback = useCallback(() => {
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
    gainNodeRef.current = null;
    setIsPlaying(false);
  }, []);

  const handleFile = (f: File) => {
    stopPlayback();
    setFile(f);
    setOutputUrl(null);
    setStatus("idle");
    setProgress(0);
    f.arrayBuffer().then((buf) => { audioDataRef.current = buf; });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play / Pause via Web Audio API + GainNode
  const togglePlay = async () => {
    if (isPlaying) { stopPlayback(); return; }
    const raw = audioDataRef.current;
    if (!raw) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    const audioBuffer = await ctx.decodeAudioData(raw.slice(0));

    const gain = ctx.createGain();
    gain.gain.value = volume / 100;
    gainNodeRef.current = gain;
    gain.connect(ctx.destination);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gain);
    source.start();
    source.onended = () => { setIsPlaying(false); sourceRef.current = null; gainNodeRef.current = null; };
    sourceRef.current = source;
    setIsPlaying(true);
  };

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

  const boost = async () => {
    if (!file) return;
    stopPlayback();
    setStatus("loading-ffmpeg");
    setProgress(0);
    try {
      const ffmpeg = await loadFFmpeg();
      setStatus("boosting");
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));

      const inputName = file.name.replace(/\s/g, "_");
      const ext = inputName.split(".").pop() ?? "mp3";
      const outName = inputName.replace(/\.[^.]+$/, "") + `_boosted.${ext}`;
      setOutputName(outName);

      const multiplier = (volume / 100).toFixed(2);
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(["-i", inputName, "-filter:a", `volume=${multiplier}`, outName]);

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
    setVolume(DEFAULT_VOL);
    setStatus("idle");
    setOutputUrl(null);
    setOutputName("");
    setProgress(0);
    audioDataRef.current = null;
  };

  const busy = status === "loading-ffmpeg" || status === "boosting";
  const { text: hintText, color: hintColor } = getHint(volume);

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
          <p className="text-sm text-muted-foreground mb-1">Volume boosted to {volume}%</p>
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
          Boost another file
        </button>
      </div>
    );
  }

  // — Drop zone —
  if (!file) {
    return (
      <label
        onDragOver={(e) => { e.preventDefault(); setDropDragging(true); }}
        onDragLeave={() => setDropDragging(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-8 py-20 cursor-pointer transition-all duration-200
          ${dropDragging ? "border-violet-500 bg-violet-500/10 scale-[1.01]" : "border-border hover:border-violet-400 hover:bg-violet-500/5"}`}
      >
        <input type="file" accept={ACCEPT} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className={`flex items-center justify-center w-16 h-16 rounded-full transition-colors ${dropDragging ? "bg-violet-500/20" : "bg-muted"}`}>
          <svg className={`w-7 h-7 ${dropDragging ? "text-violet-400" : "text-muted-foreground"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            {dropDragging ? "Drop your file here" : "Drag & drop or click to browse"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">MP3 · WAV · FLAC · M4A · AAC · OGG · OPUS</p>
        </div>
      </label>
    );
  }

  // — Controls —
  return (
    <div className="flex flex-col gap-5">
      {/* Compact file row with Preview button */}
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
        <svg className="w-4 h-4 shrink-0 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
        <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none ml-1" aria-label="Remove">×</button>
      </div>

      {/* Volume control card */}
      <div className="rounded-2xl border border-border/60 bg-card px-6 py-5 flex flex-col gap-4">
        {/* Value display */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Volume boost</p>
            <p className="text-4xl font-bold tabular-nums text-foreground">
              {volume}<span className="text-2xl font-semibold ml-0.5 text-muted-foreground">%</span>
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-1">×{(volume / 100).toFixed(1)}</p>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={MIN_VOL}
          max={MAX_VOL}
          step={STEP}
          value={volume}
          onChange={(e) => {
            const v = Number(e.target.value);
            setVolume(v);
            // Live update: just change gain value, no restart needed
            if (gainNodeRef.current) {
              gainNodeRef.current.gain.value = v / 100;
            }
          }}
          className="w-full accent-violet-500 cursor-pointer"
        />

        {/* Hint */}
        <p className={`text-xs font-medium ${hintColor}`}>{hintText}</p>

        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border/60 bg-background text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
        >
          {isPlaying ? (
            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>Pause</>
          ) : (
            <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Play</>
          )}
        </button>
      </div>

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

      {/* Boost button */}
      <button
        onClick={boost}
        disabled={busy}
        className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
          bg-violet-600 text-white hover:bg-violet-500 active:scale-[0.99]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-violet-600"
      >
        {status === "loading-ffmpeg"
          ? "Loading FFmpeg…"
          : status === "boosting"
          ? `Boosting… ${progress}%`
          : `Boost Volume to ${volume}%`}
      </button>
    </div>
  );
}
