import type { DocsNavItem } from "../content/docsNav";
import { docsPagePath } from "./routes";

/** Build a clean Markdown document suitable for pasting into an LLM. */
export function buildDocsLlmMarkdown(
  page: DocsNavItem,
  body: string,
  origin?: string,
): string {
  const path = docsPagePath(page.slug);
  const url =
    origin !== undefined && origin.length > 0
      ? new URL(path === "/" ? "/" : path, origin).toString()
      : path;

  return [
    `# ${page.title}`,
    "",
    page.description,
    "",
    `> Avon documentation · \`${path}\``,
    `> ${url}`,
    "",
    "---",
    "",
    body.trim(),
    "",
  ].join("\n");
}

export function buildDocsRawMarkdown(page: DocsNavItem, body: string): string {
  return [
    `# ${page.title}`,
    "",
    `_${page.description}_`,
    "",
    body.trim(),
    "",
  ].join("\n");
}
