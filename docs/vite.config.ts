import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const docsRoot = fileURLToPath(new URL("./src/docs", import.meta.url));
/** Developer docs - only bundled by `vite dev`, never mirrored publicly. */
const devRoot = fileURLToPath(new URL("./src/dev", import.meta.url));
const devDocsRoot = join(devRoot, "docs");
const devDocsEntry = join(devRoot, "index.ts");
const packageRoot = fileURLToPath(new URL(".", import.meta.url));
/** Monorepo root `.env` (shares `LTI_TOOL_BASE_URL` with the API). */
const monorepoRoot = fileURLToPath(new URL("../..", import.meta.url));

function listMarkdownFiles(dir: string): string[] {
  const out: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);

    if (entry.isDirectory()) {
      out.push(...listMarkdownFiles(abs));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(abs);
    }
  }

  return out;
}

function gitLastCommitIso(filePath: string): string | null {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", filePath],
      { cwd: packageRoot, encoding: "utf8" },
    ).trim();

    return iso.length > 0 ? iso : null;
  } catch {
    return null;
  }
}

function buildLastUpdatedBySlug(
  roots: readonly string[],
): Record<string, string> {
  const map: Record<string, string> = {};

  for (const root of roots) {
    for (const abs of listMarkdownFiles(root)) {
      const slug = relative(root, abs)
        .replaceAll("\\", "/")
        .replace(/\.md$/u, "");
      map[slug] = gitLastCommitIso(abs) ?? statSync(abs).mtime.toISOString();
    }
  }

  return map;
}

/** Virtual module: last git commit (or mtime) per docs markdown slug. */
function docsLastUpdatedPlugin(roots: readonly string[]): Plugin {
  const virtualId = "virtual:docs-last-updated";
  const resolvedId = `\0${virtualId}`;

  return {
    name: "docs-last-updated",
    resolveId(id) {
      if (id === virtualId) {
        return resolvedId;
      }

      return undefined;
    },
    load(id) {
      if (id !== resolvedId) {
        return undefined;
      }

      return `export const lastUpdatedBySlug = ${JSON.stringify(buildLastUpdatedBySlug(roots))};`;
    },
  };
}

/**
 * Virtual module: developer docs (nav, content, welcome card) when serving
 * locally, or an empty module for production builds and checkouts without
 * `src/dev` (the public docs mirror).
 */
function devDocsPlugin(includeDevDocs: boolean): Plugin {
  const virtualId = "virtual:dev-docs";
  const emptyId = `\0${virtualId}`;

  return {
    name: "dev-docs",
    resolveId(id) {
      if (id !== virtualId) {
        return undefined;
      }

      return includeDevDocs ? devDocsEntry : emptyId;
    },
    load(id) {
      if (id !== emptyId) {
        return undefined;
      }

      return [
        "export const devDocsNav = [];",
        "export const devDocsContent = {};",
        "export const devWelcomeCard = null;",
      ].join("\n");
    },
  };
}

export default defineConfig(({ command }) => {
  const includeDevDocs = command === "serve" && existsSync(devDocsEntry);

  return {
    // Load monorepo `.env` so docs can show the real `LTI_TOOL_BASE_URL` value.
    envDir: monorepoRoot,
    envPrefix: ["VITE_", "LTI_"],
    plugins: [
      devDocsPlugin(includeDevDocs),
      docsLastUpdatedPlugin(
        includeDevDocs ? [docsRoot, devDocsRoot] : [docsRoot],
      ),
      tailwindcss(),
      react(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 5174,
    },
    test: {
      environment: "happy-dom",
      globals: true,
      setupFiles: "./vitest.setup.ts",
    },
  };
});
