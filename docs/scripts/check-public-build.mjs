// Fails if any developer-only docs content (src/dev) ended up in dist/.
// Developer docs are only meant to be bundled by `vite dev`; the public docs
// mirror strips src/dev entirely, so this guards the private build in CI.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const devRoot = join(packageRoot, "src", "dev");
const distRoot = join(packageRoot, "dist");

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(abs) : [abs];
  });
}

if (!existsSync(distRoot)) {
  console.error("dist/ not found - run the docs build first.");
  process.exit(1);
}

if (!existsSync(devRoot)) {
  console.log("No src/dev in this checkout; nothing to check.");
  process.exit(0);
}

// Distinctive phrases: long markdown lines and long string literals from the
// dev nav. Skip text with characters the bundler would escape.
const markers = new Set();
for (const file of listFiles(devRoot)) {
  const text = readFileSync(file, "utf8");
  const candidates = file.endsWith(".md")
    ? text.split("\n")
    : [...text.matchAll(/"([^"\n]+)"/gu)].map((match) => match[1]);
  for (const raw of candidates) {
    const line = raw.trim();
    if (line.length >= 40 && !/["'`\\]/u.test(line)) {
      markers.add(line);
    }
  }
}

// Ignore phrases that public pages legitimately share (e.g. related links).
const publicSource = listFiles(join(packageRoot, "src"))
  .filter((file) => !file.startsWith(devRoot))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");
for (const marker of markers) {
  if (publicSource.includes(marker)) {
    markers.delete(marker);
  }
}

const bundle = listFiles(distRoot)
  .filter((file) => /\.(?:js|html|css|json|txt|map)$/u.test(file))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

const leaked = [...markers].filter((marker) => bundle.includes(marker));

if (leaked.length > 0) {
  console.error(
    `Developer docs leaked into the public docs build (${leaked.length} matches):`,
  );
  for (const marker of leaked.slice(0, 10)) {
    console.error(`  - ${marker}`);
  }
  process.exit(1);
}

console.log(
  `Public docs build is clean (${markers.size} developer markers checked).`,
);
