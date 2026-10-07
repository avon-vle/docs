import { useEffect, useState } from "react";
import { DocsLink } from "../components/DocsLink";
import { DocsMarkdown } from "../components/DocsMarkdown";
import {
  DocsPageActions,
  type DocsPageViewMode,
} from "../components/DocsPageActions";
import { DocsShell } from "../components/DocsShell";
import { DocsToc } from "../components/DocsToc";
import { DocsWelcome } from "../components/DocsWelcome";
import {
  getDocsPage,
  isWelcomeSlug,
  normalizeDocsSlug,
} from "../content/docsNav";
import { extractDocsHeadings, getDocsMarkdown } from "../lib/docsContent";
import { docsHomePath } from "../lib/routes";

export const DocsPage = ({ slug }: { readonly slug: string }) => {
  const normalized = normalizeDocsSlug(slug);
  const page = getDocsPage(normalized);
  const markdown = getDocsMarkdown(normalized);
  const [viewMode, setViewMode] = useState<DocsPageViewMode>("rendered");

  useEffect(() => {
    setViewMode("rendered");
  }, [normalized]);

  if (isWelcomeSlug(normalized) && page !== null) {
    return (
      <DocsShell activeSlug={page.slug} contentWidth="wide">
        <DocsWelcome />
      </DocsShell>
    );
  }

  if (page === null || markdown === null) {
    return (
      <DocsShell activeSlug={normalized}>
        <p className="text-sm font-medium text-[var(--avon-docs-muted)]">
          Documentation
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-[var(--avon-docs-text)] sm:text-4xl">
          Page not found
        </h1>
        <p className="avon-docs-prose mt-4">
          That docs path does not exist yet.
        </p>
        <DocsLink
          className="mt-6 inline-flex text-sm font-medium text-[var(--avon-docs-text)] underline-offset-4 hover:underline"
          href={docsHomePath}
        >
          Back to docs home
        </DocsLink>
      </DocsShell>
    );
  }

  const headings = extractDocsHeadings(markdown);

  if (viewMode === "markdown") {
    return (
      <DocsShell activeSlug={page.slug}>
        <div className="avon-docs-raw-toolbar">
          <DocsPageActions
            body={markdown}
            onViewModeChange={setViewMode}
            page={page}
            viewMode={viewMode}
          />
        </div>
        <pre className="avon-docs-raw-markdown">{markdown}</pre>
      </DocsShell>
    );
  }

  return (
    <DocsShell
      activeSlug={page.slug}
      toc={
        headings.length > 0 ? (
          <DocsToc body={markdown} headings={headings} page={page} />
        ) : undefined
      }
    >
      <p className="text-sm font-medium text-[var(--avon-docs-muted)]">
        Documentation
      </p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-[var(--avon-docs-text)] sm:text-4xl">
        {page.title}
      </h1>

      <DocsPageActions
        body={markdown}
        onViewModeChange={setViewMode}
        page={page}
        viewMode={viewMode}
      />

      <p className="avon-docs-prose mt-5 max-w-xl">{page.description}</p>

      <div className="mt-8 border-t border-[var(--avon-docs-border)] pt-8">
        <DocsMarkdown content={markdown} />
      </div>
    </DocsShell>
  );
};
