export type DocsRoute = {
  readonly kind: "docs";
  readonly slug: string;
};

export const docsHomePath = "/" as const;

export const docsPagePath = (slug: string) =>
  slug === "" ? docsHomePath : `/${slug}`;

export function resolveDocsRoute(pathname: string): DocsRoute {
  const trimmed = pathname.replace(/\/+$/u, "") || "/";
  const raw = trimmed === "/" ? "" : trimmed.replace(/^\//u, "");
  const slug = raw
    .split("/")
    .filter(Boolean)
    .map((segment) => decodePathSegment(segment))
    .join("/");

  return { kind: "docs", slug };
}

export function isInternalDocsPath(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function decodePathSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
