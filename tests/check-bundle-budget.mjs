// Bundle budget check — run after `vite build` (see docs/ci-budgets-2026-10-27.md).
// Usage: node tests/check-bundle-budget.mjs [dist-dir]
// Reads budgets from tests/bundle-budgets.json (same directory as this script).
// Scope: ALL .js files under dist/, not just the main bundle — the main
// bundle alone (2,266,589 bytes) understates the shipped JS, which also
// includes Pixi vendor chunks and many small asset chunks (1,465 JS files
// in the 2026-10-27 build, 2,969,102 bytes raw / 976,249 bytes gzip total).
// Exit 0 = within budget, 1 = budget exceeded, 2 = dist dir / JS output missing.
// No browser, no network: it only reads the local dist/ output.
import { readdirSync, statSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const budgets = JSON.parse(readFileSync(join(here, "bundle-budgets.json"), "utf8"));
const distDir = process.argv[2] || "dist";

function walkJs(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkJs(p, out);
    else if (entry.name.endsWith(".js")) out.push(p);
  }
  return out;
}

if (!existsSync(distDir)) {
  console.error(`BUDGET CHECK FAIL: dist dir not found: ${distDir} (run vite build first)`);
  process.exit(2);
}
const files = walkJs(distDir);
if (files.length === 0) {
  console.error(`BUDGET CHECK FAIL: no .js files under ${distDir}`);
  process.exit(2);
}
let totalRaw = 0;
let totalGzip = 0;
let largest = { file: "", bytes: 0, gzip: 0 };
for (const f of files) {
  const buf = readFileSync(f);
  const gz = gzipSync(buf).length;
  totalRaw += buf.length;
  totalGzip += gz;
  if (buf.length > largest.bytes) largest = { file: f, bytes: buf.length, gzip: gz };
}
console.log(`JS files: ${files.length}`);
console.log(`Largest chunk: ${largest.file} = ${largest.bytes} bytes raw (budget ${budgets.largestJsChunkMaxBytes}), ${largest.gzip} bytes gzip (budget ${budgets.largestJsChunkGzipMaxBytes})`);
console.log(`Total JS raw: ${totalRaw} bytes (budget ${budgets.totalJsMaxBytes})`);
console.log(`Total JS gzip: ${totalGzip} bytes (budget ${budgets.totalJsGzipMaxBytes})`);
const failures = [];
if (largest.bytes > budgets.largestJsChunkMaxBytes)
  failures.push(`largest chunk raw ${largest.bytes} > ${budgets.largestJsChunkMaxBytes}`);
if (largest.gzip > budgets.largestJsChunkGzipMaxBytes)
  failures.push(`largest chunk gzip ${largest.gzip} > ${budgets.largestJsChunkGzipMaxBytes}`);
if (totalRaw > budgets.totalJsMaxBytes)
  failures.push(`total JS raw ${totalRaw} > ${budgets.totalJsMaxBytes}`);
if (totalGzip > budgets.totalJsGzipMaxBytes)
  failures.push(`total JS gzip ${totalGzip} > ${budgets.totalJsGzipMaxBytes}`);
if (failures.length > 0) {
  console.error("BUDGET CHECK FAIL:");
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log("BUDGET CHECK PASS: all JS budgets met.");
