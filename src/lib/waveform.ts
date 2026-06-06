/** Format seconds as m:ss */
export function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Downsample AudioBuffer channel data to N peaks */
export function extractPeaks(buffer: AudioBuffer, count: number): Float32Array {
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

/** Draw waveform on canvas with selection highlight and optional playhead */
export function drawCanvas(
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
