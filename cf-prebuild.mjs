// Windows only: Turbopack links serverExternalPackages as directory junctions in
// .next/node_modules. OpenNext re-creates them with symlinkSync(), which needs admin
// rights on Windows (EPERM). Make it create junctions instead. Idempotent.
import fs from "node:fs";
const f = "node_modules/@opennextjs/aws/dist/build/copyTracedFiles.js";
const s = fs.readFileSync(f, "utf8");
const from = "symlinkSync(symlink, to);";
const to = 'symlinkSync(symlink, to, process.platform === "win32" ? "junction" : undefined);';
if (s.includes(from)) { fs.writeFileSync(f, s.replace(from, to)); console.log("cf-prebuild: patched junctions"); }
else console.log("cf-prebuild: already patched or not needed");

// Windows only: the Turbopack runtime patch receives traced file paths with
// backslashes, so its chunk switch never matches and wasm imports become invalid
// JS strings. Normalise them to forward slashes. Idempotent.
{
  const f2 = "node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/turbopack.js";
  const s2 = fs.readFileSync(f2, "utf8");
  const a = "patchCode: async ({ code, tracedFiles, filePath }) => {";
  const b = a + '\n                tracedFiles = tracedFiles.map((f) => f.replaceAll("\\\\", "/"));';
  if (s2.includes(a) && !s2.includes('tracedFiles = tracedFiles.map(')) { fs.writeFileSync(f2, s2.replace(a, b)); console.log("cf-prebuild: patched turbopack paths"); }
}
