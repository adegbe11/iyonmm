// Lazy-loaded single-threaded ffmpeg.wasm. Single-threaded core needs no
// COOP/COEP headers, so it does not break AdSense or third-party embeds.
// The ~30MB core is fetched from a CDN on first use and cached by the browser.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ffmpegPromise: Promise<any> | null = null;

export function loadFFmpeg(onProgress?: (ratio: number) => void) {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ff = new FFmpeg();
      const base = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
      await ff.load({
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
      });
      return ff;
    })();
  }
  return ffmpegPromise.then((ff) => {
    if (onProgress) {
      ff.on("progress", ({ progress }: { progress: number }) => onProgress(Math.min(1, Math.max(0, progress))));
    }
    return ff;
  });
}
