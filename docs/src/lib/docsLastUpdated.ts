import { lastUpdatedBySlug } from "virtual:docs-last-updated";

/** ISO timestamp of the last git commit that touched this doc slug, if known. */
export function getDocsLastUpdatedIso(slug: string): string | null {
  if (slug === "") {
    return null;
  }

  return lastUpdatedBySlug[slug] ?? null;
}

/** Human-readable “Last updated …” label for the page footer. */
export function formatDocsLastUpdated(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
