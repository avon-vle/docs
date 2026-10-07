import { useCallback, useEffect, useState } from "react";
import { Check, Copy, FileText } from "lucide";
import type { DocsNavItem } from "../content/docsNav";
import { buildDocsLlmMarkdown } from "../lib/docsExport";
import { renderLucideNodes } from "../lib/icons";

export type DocsPageViewMode = "rendered" | "markdown";

export const DocsPageActions = ({
  body,
  onViewModeChange,
  page,
  viewMode,
}: {
  readonly body: string;
  readonly onViewModeChange: (mode: DocsPageViewMode) => void;
  readonly page: DocsNavItem;
  readonly viewMode: DocsPageViewMode;
}) => {
  const [copiedLlm, setCopiedLlm] = useState(false);

  useEffect(() => {
    setCopiedLlm(false);
  }, [page.slug, viewMode]);

  const copyForLlm = useCallback(async () => {
    const payload = buildDocsLlmMarkdown(
      page,
      body,
      typeof window !== "undefined" ? window.location.origin : undefined,
    );

    try {
      await navigator.clipboard.writeText(payload);
      setCopiedLlm(true);
      window.setTimeout(() => {
        setCopiedLlm(false);
      }, 1800);
    } catch {
      // Clipboard can fail in insecure contexts; ignore quietly.
    }
  }, [body, page]);

  const markdownActive = viewMode === "markdown";

  return (
    <div className="avon-docs-page-actions">
      <button
        className="avon-docs-page-action"
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
          {renderLucideNodes(copiedLlm ? Check : Copy)}
        </svg>
        <span>{copiedLlm ? "Copied for LLM" : "Copy for LLM"}</span>
      </button>

      <span aria-hidden="true" className="avon-docs-page-action-sep">
        |
      </span>

      <button
        aria-pressed={markdownActive}
        className={`avon-docs-page-action${markdownActive ? " avon-docs-page-action--active" : ""}`}
        onClick={() => {
          onViewModeChange(markdownActive ? "rendered" : "markdown");
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
          {renderLucideNodes(FileText)}
        </svg>
        <span>{markdownActive ? "View rendered" : "View as Markdown"}</span>
      </button>
    </div>
  );
};
