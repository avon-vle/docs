import { useCallback, useState, type MouseEvent } from "react";
import { Check, Copy, List } from "lucide";
import type { DocsNavItem } from "../content/docsNav";
import type { DocsHeading } from "../lib/docsContent";
import { buildDocsLlmMarkdown } from "../lib/docsExport";
import { scrollToHeadingAndFlash } from "../lib/flashHeading";
import { renderLucideNodes } from "../lib/icons";
import { docsPagePath } from "../lib/routes";

export const DocsToc = ({
  body,
  headings,
  page,
}: {
  readonly body: string;
  readonly headings: readonly DocsHeading[];
  readonly page: DocsNavItem;
}) => {
  const [copied, setCopied] = useState(false);

  const copyForLlm = useCallback(async () => {
    const payload = buildDocsLlmMarkdown(
      page,
      body,
      typeof window !== "undefined" ? window.location.origin : undefined,
    );

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard can fail in insecure contexts; ignore quietly.
    }
  }, [body, page]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="avon-docs-toc-panel">
      <div className="avon-docs-toc-heading">
        <p className="avon-docs-toc-title">On this page</p>
        <span aria-hidden="true" className="avon-docs-toc-icon">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            viewBox="0 0 24 24"
          >
            {renderLucideNodes(List)}
          </svg>
        </span>
      </div>

      <nav aria-label="On this page" className="avon-docs-toc-nav">
        {headings.map((heading) => (
          <a
            className="avon-docs-toc-link"
            href={`${docsPagePath(page.slug)}#${heading.id}`}
            key={heading.id}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              event.preventDefault();
              scrollToHeadingAndFlash(heading.id);
            }}
          >
            {heading.title}
          </a>
        ))}
      </nav>

      <div className="avon-docs-toc-footer">
        <button
          className="avon-docs-toc-copy"
          onClick={() => {
            void copyForLlm();
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
            viewBox="0 0 24 24"
          >
            {renderLucideNodes(copied ? Check : Copy)}
          </svg>
          <span>{copied ? "Copied for LLM" : "Copy for LLM"}</span>
        </button>
      </div>
    </div>
  );
};
