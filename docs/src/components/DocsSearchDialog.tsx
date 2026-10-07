import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { FileText, Search } from "lucide";
import { useDocsNavigation } from "../context/DocsNavigationContext";
import { searchDocs, type DocsSearchHit } from "../lib/docsSearch";
import { renderLucideNodes } from "../lib/icons";
import { preventBackgroundScroll } from "../lib/lockBodyScroll";

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    target.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );
};

const modifierLabel =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/u.test(navigator.platform)
    ? "⌘"
    : "Ctrl";

export const DocsSearchDialog = ({
  onOpenChange,
  open,
}: {
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
}) => {
  const { navigate } = useDocsNavigation();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchDocs(query), [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery("");
    setActiveIndex(0);
    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // Don't touch body overflow — keeps sticky sidebars where they were.
    return preventBackgroundScroll();
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isPalette =
        (event.metaKey || event.ctrlKey) && key === "k" && !event.altKey;
      const isSlash = key === "/" && !event.metaKey && !event.ctrlKey;

      if (isPalette) {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (isSlash && !open && !isEditableTarget(event.target)) {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  const selectHit = (hit: DocsSearchHit) => {
    onOpenChange(false);
    navigate(hit.path);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0 ? 0 : Math.min(index + 1, results.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const hit = results[activeIndex];

      if (hit !== undefined) {
        selectHit(hit);
      }
    }
  };

  return (
    <div className="avon-docs-search-dialog fixed inset-0 z-[80]">
      <button
        aria-label="Close search"
        className="absolute inset-0 bg-stone-950/45 backdrop-blur-[1px]"
        onClick={() => {
          onOpenChange(false);
        }}
        type="button"
      />
      <div
        aria-labelledby={`${listId}-label`}
        aria-modal="true"
        className="avon-docs-search-panel relative mx-auto mt-[12vh] w-[min(36rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-[var(--avon-docs-border)] bg-[var(--avon-docs-surface)] shadow-[0_24px_80px_rgb(0_0_0_/_28%)]"
        role="dialog"
      >
        <div className="flex items-center gap-2 border-b border-[var(--avon-docs-border)] px-3">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[var(--avon-docs-faint)]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {renderLucideNodes(Search)}
          </svg>
          <input
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded="true"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="h-12 w-full border-0 bg-transparent text-sm text-[var(--avon-docs-text)] outline-none placeholder:text-[var(--avon-docs-faint)]"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search documentation…"
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="search"
            value={query}
          />
          <kbd className="hidden shrink-0 rounded border border-[var(--avon-docs-border)] px-1.5 py-0.5 font-sans text-[10px] text-[var(--avon-docs-faint)] sm:inline">
            Esc
          </kbd>
        </div>

        <div
          aria-label="Search results"
          className="max-h-[min(24rem,50vh)] overflow-y-auto p-2"
          data-allow-scroll=""
          id={listId}
          role="listbox"
        >
          <p className="sr-only" id={`${listId}-label`}>
            Documentation search
          </p>
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-[var(--avon-docs-muted)]">
              No results for “{query.trim()}”.
            </p>
          ) : (
            <ul className="grid gap-0.5">
              {results.map((hit, index) => {
                const active = index === activeIndex;

                return (
                  <li key={hit.slug || "introduction"} role="presentation">
                    <button
                      aria-selected={active}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "bg-[var(--avon-docs-active)] text-[var(--avon-docs-active-text)]"
                          : "text-[var(--avon-docs-text)] hover:bg-[var(--avon-docs-hover)]"
                      }`}
                      onClick={() => {
                        selectHit(hit);
                      }}
                      onMouseEnter={() => {
                        setActiveIndex(index);
                      }}
                      role="option"
                      type="button"
                    >
                      <svg
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--avon-docs-faint)]"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        {renderLucideNodes(FileText)}
                      </svg>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-sm font-medium">
                            {hit.title}
                          </span>
                          <span className="shrink-0 text-[11px] text-[var(--avon-docs-faint)]">
                            {hit.group}
                          </span>
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-[var(--avon-docs-muted)]">
                          {hit.snippet ?? hit.description}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--avon-docs-border)] px-3 py-2 text-[11px] text-[var(--avon-docs-faint)]">
          <span>
            <kbd className="rounded border border-[var(--avon-docs-border)] px-1 font-sans">
              ↑↓
            </kbd>{" "}
            navigate
            <span className="mx-2">·</span>
            <kbd className="rounded border border-[var(--avon-docs-border)] px-1 font-sans">
              ↵
            </kbd>{" "}
            open
          </span>
          <span>
            <kbd className="rounded border border-[var(--avon-docs-border)] px-1 font-sans">
              {modifierLabel}K
            </kbd>
          </span>
        </div>
      </div>
    </div>
  );
};

export const docsSearchShortcutLabel = `${modifierLabel}K`;
