import { docsNav, navItemsForGroup } from "../content/docsNav";
import { getDocsMarkdown } from "./docsContent";
import { docsPagePath } from "./routes";

export type DocsSearchDocument = {
  readonly body: string;
  readonly description: string;
  readonly group: string;
  readonly path: string;
  readonly slug: string;
  readonly title: string;
};

export type DocsSearchHit = DocsSearchDocument & {
  readonly score: number;
  readonly snippet: string | null;
};

const stripMarkdown = (markdown: string): string =>
  markdown
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/gu, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/^#{1,6}\s+/gmu, "")
    .replace(/[*_~>|-]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();

const buildIndex = (): readonly DocsSearchDocument[] =>
  docsNav.flatMap((group) =>
    navItemsForGroup(group).map((item) => {
      const markdown = getDocsMarkdown(item.slug) ?? "";

      return {
        body: stripMarkdown(markdown),
        description: item.description,
        group: group.title,
        path: docsPagePath(item.slug),
        slug: item.slug,
        title: item.title,
      };
    }),
  );

let cachedIndex: readonly DocsSearchDocument[] | null = null;

export const getDocsSearchIndex = (): readonly DocsSearchDocument[] => {
  cachedIndex ??= buildIndex();
  return cachedIndex;
};

const tokenize = (query: string): readonly string[] =>
  query
    .toLowerCase()
    .split(/[^a-z0-9_/-]+/u)
    .filter((token) => token.length > 0);

const tokenFieldScore = (field: string, token: string): number => {
  const haystack = field.toLowerCase();

  if (!haystack.includes(token)) {
    return 0;
  }

  if (haystack === token) {
    return 12;
  }

  if (haystack.startsWith(token)) {
    return 8;
  }

  if (new RegExp(`\\b${escapeRegExp(token)}`, "u").test(haystack)) {
    return 5;
  }

  return 2;
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

const makeSnippet = (
  body: string,
  tokens: readonly string[],
): string | null => {
  if (tokens.length === 0 || body.length === 0) {
    return null;
  }

  const lower = body.toLowerCase();
  let bestIndex = -1;

  for (const token of tokens) {
    const index = lower.indexOf(token);

    if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
      bestIndex = index;
    }
  }

  if (bestIndex === -1) {
    return null;
  }

  const radius = 48;
  const start = Math.max(0, bestIndex - radius);
  const end = Math.min(body.length, bestIndex + radius + 16);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < body.length ? "…" : "";

  return `${prefix}${body.slice(start, end).trim()}${suffix}`;
};

export const searchDocs = (
  query: string,
  limit = 12,
): readonly DocsSearchHit[] => {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return getDocsSearchIndex()
      .slice(0, Math.min(8, limit))
      .map((doc) => ({
        ...doc,
        score: 0,
        snippet: null,
      }));
  }

  const hits: DocsSearchHit[] = [];

  for (const doc of getDocsSearchIndex()) {
    let score = 0;
    let matchedInBody = false;
    let allPresent = true;

    for (const token of tokens) {
      const titleHit = tokenFieldScore(doc.title, token) * 5;
      const descriptionHit = tokenFieldScore(doc.description, token) * 3;
      const groupHit = tokenFieldScore(doc.group, token) * 2;
      const bodyHit = tokenFieldScore(doc.body, token);
      const best = Math.max(titleHit, descriptionHit, groupHit, bodyHit);

      if (best === 0) {
        allPresent = false;
        break;
      }

      if (bodyHit > 0) {
        matchedInBody = true;
      }

      score += best;
    }

    if (!allPresent || score <= 0) {
      continue;
    }

    hits.push({
      ...doc,
      score,
      snippet: matchedInBody
        ? makeSnippet(doc.body, tokens)
        : doc.description.slice(0, 120),
    });
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
};
