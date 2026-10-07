import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Menu, Search, X } from "lucide";
import { getDocsProductId } from "../content/docsNav";
import { useDocsTheme } from "../context/DocsThemeContext";
import { env } from "../env";
import {
  formatDocsLastUpdated,
  getDocsLastUpdatedIso,
} from "../lib/docsLastUpdated";
import { renderLucideNodes } from "../lib/icons";
import { lockBodyScroll } from "../lib/lockBodyScroll";
import { docsHomePath } from "../lib/routes";
import { DocsLink } from "./DocsLink";
import { DocsProductSwitch } from "./DocsProductSwitch";
import { DocsSearchDialog, docsSearchShortcutLabel } from "./DocsSearchDialog";
import { DocsSidebar } from "./DocsSidebar";
import { ThemeToggle } from "./ThemeToggle";

export const DocsShell = ({
  activeSlug,
  children,
  contentWidth = "default",
  toc,
}: {
  readonly activeSlug: string;
  readonly children: ReactNode;
  readonly contentWidth?: "default" | "wide";
  readonly toc?: ReactNode;
}) => {
  const { resolvedTheme } = useDocsTheme();
  const dark = resolvedTheme === "dark";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Freeze background scroll without jumping layout (search + mobile nav).
  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    return lockBodyScroll();
  }, [mobileNavOpen]);

  const siteLinkClassName = `inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-sm no-underline transition-colors ${
    dark
      ? "border-[var(--avon-docs-border)] bg-[var(--avon-docs-code-bg)] text-[var(--avon-docs-faint)] hover:text-[#f5f5f4]"
      : "border-[var(--avon-docs-border)] bg-[var(--avon-docs-surface)] text-[var(--avon-docs-muted)] hover:text-[var(--avon-docs-text)]"
  }`;

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const openSearch = () => {
    setMobileNavOpen(false);
    setSearchOpen(true);
  };

  const lastUpdatedIso = getDocsLastUpdatedIso(activeSlug);
  const lastUpdatedLabel =
    lastUpdatedIso === null ? null : formatDocsLastUpdated(lastUpdatedIso);
  const productId = getDocsProductId(activeSlug);

  const renderSiteLink = () => (
    <a className={siteLinkClassName} href={env.VITE_WEB_URL}>
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {renderLucideNodes(ArrowLeft)}
      </svg>
      Back to site
    </a>
  );

  return (
    <div className="avon-docs-page flex min-h-screen flex-col">
      <header className="avon-docs-topbar">
        <div className="relative flex h-full items-center gap-2 px-4 sm:gap-3 sm:px-5 lg:px-6">
          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
            <DocsLink
              aria-label="Avon docs home"
              className="flex shrink-0 items-center no-underline"
              href={docsHomePath}
            >
              <img
                alt=""
                className={`h-5 w-auto ${
                  resolvedTheme === "dark"
                    ? "brightness-0 invert"
                    : "brightness-0"
                }`}
                height={120}
                src="/avon-logo.svg"
                width={293}
              />
            </DocsLink>
            <DocsProductSwitch productId={productId} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 hidden justify-center sm:flex">
            <div className="pointer-events-auto w-full max-w-md px-4">
              <button
                className="avon-docs-search flex h-8 items-center gap-2 px-2.5"
                onClick={openSearch}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  {renderLucideNodes(Search)}
                </svg>
                <span className="truncate text-sm">Search docs…</span>
                <kbd className="ml-auto hidden rounded border border-[var(--avon-docs-border)] px-1.5 py-0.5 font-sans text-[10px] text-[var(--avon-docs-faint)] sm:inline">
                  {docsSearchShortcutLabel}
                </kbd>
              </button>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden lg:contents">
              {renderSiteLink()}
              <ThemeToggle />
            </div>
            <button
              aria-label="Search documentation"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--avon-docs-border)] text-[var(--avon-docs-text)] sm:hidden"
              onClick={openSearch}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {renderLucideNodes(Search)}
              </svg>
            </button>
            <button
              aria-label={mobileNavOpen ? "Close docs menu" : "Open docs menu"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--avon-docs-border)] text-[var(--avon-docs-text)] lg:hidden"
              onClick={() => {
                setMobileNavOpen((open) => !open);
              }}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {renderLucideNodes(mobileNavOpen ? X : Menu)}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <DocsSearchDialog onOpenChange={setSearchOpen} open={searchOpen} />

      {mobileNavOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 top-[var(--avon-docs-topbar-h)] z-30 overscroll-none border-b border-[var(--avon-docs-border)] bg-[var(--avon-docs-sidebar)] lg:hidden"
          role="dialog"
        >
          <div className="flex h-full flex-col overflow-hidden overscroll-contain">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--avon-docs-border)] px-4 py-3">
              {renderSiteLink()}
              <ThemeToggle />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <DocsSidebar
                activeSlug={activeSlug}
                onNavigate={closeMobileNav}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full min-w-0 flex-1">
        <aside className="avon-docs-sidebar sticky top-[var(--avon-docs-topbar-h)] hidden max-h-[calc(100dvh-var(--avon-docs-topbar-h))] shrink-0 overflow-y-auto lg:block">
          <DocsSidebar activeSlug={activeSlug} />
        </aside>

        <div className="flex min-w-0 flex-1">
          <main
            aria-label="Documentation"
            className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-10"
          >
            <div
              className={`mx-auto w-full min-w-0 ${
                contentWidth === "wide" ? "max-w-4xl" : "max-w-2xl"
              }`}
            >
              {children}
              {lastUpdatedLabel !== null ? (
                <div className="avon-docs-page-end">
                  <p className="avon-docs-last-updated">
                    Last updated {lastUpdatedLabel}
                  </p>
                </div>
              ) : null}
            </div>
          </main>

          {toc ? (
            <aside className="avon-docs-toc sticky top-[var(--avon-docs-topbar-h)] hidden max-h-[calc(100dvh-var(--avon-docs-topbar-h))] shrink-0 overflow-y-auto xl:block">
              <div className="avon-docs-toc-inner">{toc}</div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
};
