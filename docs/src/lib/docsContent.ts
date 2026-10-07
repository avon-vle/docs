import { devDocsContent } from "virtual:dev-docs";
import { env } from "../env";

const docsModules = import.meta.glob("../docs/**/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export type DocsHeading = {
  readonly id: string;
  readonly title: string;
};

function modulePathToSlug(modulePath: string): string {
  const match = /\/docs\/(.+)\.md$/u.exec(modulePath);

  if (match === null) {
    return "";
  }

  const raw = match[1] ?? "";

  // help/index.md → help, cli/index.md → cli
  if (raw.endsWith("/index")) {
    return raw.slice(0, -"/index".length);
  }

  if (raw === "index") {
    return "";
  }

  return raw;
}

const contentBySlug = new Map<string, string>(
  Object.entries({ ...docsModules, ...devDocsContent }).map(
    ([modulePath, content]) => [modulePathToSlug(modulePath), content.trim()],
  ),
);

/** Substitute deploy-time values so admins see real hosts, not env var names. */
function applyDocsPlaceholders(markdown: string): string {
  return markdown.replaceAll("{{LTI_TOOL_BASE_URL}}", env.LTI_TOOL_BASE_URL);
}

export function getDocsMarkdown(slug: string): string | null {
  const content = contentBySlug.get(slug);

  if (content === undefined) {
    return null;
  }

  return applyDocsPlaceholders(content);
}

export function extractDocsHeadings(markdown: string): readonly DocsHeading[] {
  const headings: DocsHeading[] = [];

  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.+?)\s*$/u.exec(line);

    if (match?.[1] === undefined) {
      continue;
    }

    const title = match[1].replace(/\s+#+\s*$/u, "").trim();

    if (title.length === 0) {
      continue;
    }

    headings.push({
      id: slugifyHeading(title),
      title,
    });
  }

  return headings;
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}
