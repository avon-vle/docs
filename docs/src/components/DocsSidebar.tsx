import { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide";
import {
  getDocsProductId,
  visibleNavForProduct,
  type DocsNavGroup,
  type DocsNavItem,
  type DocsNavSection,
} from "../content/docsNav";
import { renderLucideNodes } from "../lib/icons";
import { docsPagePath } from "../lib/routes";
import { DocsLink } from "./DocsLink";

export const DocsSidebar = ({
  activeSlug,
  onNavigate,
}: {
  readonly activeSlug: string;
  readonly onNavigate?: () => void;
}) => {
  const product = getDocsProductId(activeSlug);
  const groups = visibleNavForProduct(product);

  return (
    <nav aria-label="Documentation" className="px-3 py-5">
      <div className="grid gap-6">
        {groups.map((group) => (
          <NavGroup
            activeSlug={activeSlug}
            group={group}
            key={`${group.product}-${group.title}`}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
};

const NavGroup = ({
  activeSlug,
  group,
  onNavigate,
}: {
  readonly activeSlug: string;
  readonly group: DocsNavGroup;
  readonly onNavigate?: () => void;
}) => {
  const hasSections = (group.sections?.length ?? 0) > 0;

  return (
    <div>
      <p className="avon-docs-nav-label px-2.5 pb-2">
        <span>{group.title}</span>
        {group.localOnly === true ? (
          <span
            className="avon-docs-nav-badge"
            title="Only visible in local dev"
          >
            Local
          </span>
        ) : null}
      </p>
      <div className={hasSections ? "grid gap-1" : "grid gap-0.5"}>
        {group.items.map((item) => (
          <DocsNavLink
            active={item.slug === activeSlug}
            item={item}
            key={item.slug || "welcome"}
            onNavigate={onNavigate}
          />
        ))}
        {group.sections?.map((section, index) => (
          <CollapsibleNavSection
            activeSlug={activeSlug}
            defaultOpen={index === 0}
            key={section.title}
            onNavigate={onNavigate}
            section={section}
          />
        ))}
      </div>
    </div>
  );
};

const CollapsibleNavSection = ({
  activeSlug,
  defaultOpen,
  onNavigate,
  section,
}: {
  readonly activeSlug: string;
  readonly defaultOpen: boolean;
  readonly onNavigate?: () => void;
  readonly section: DocsNavSection;
}) => {
  const containsActivePage = section.items.some(
    (item) => item.slug === activeSlug,
  );
  const [open, setOpen] = useState(defaultOpen || containsActivePage);
  const contentId = useId();

  useEffect(() => {
    if (containsActivePage) {
      setOpen(true);
    }
  }, [containsActivePage]);

  return (
    <div>
      <button
        aria-controls={contentId}
        aria-expanded={open}
        className="avon-docs-nav-section"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span>{section.title}</span>
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          {renderLucideNodes(open ? ChevronDown : ChevronRight)}
        </svg>
      </button>
      {open ? (
        <div className="avon-docs-nav-children grid gap-0.5" id={contentId}>
          {section.items.map((item) => (
            <DocsNavLink
              active={item.slug === activeSlug}
              item={item}
              key={item.slug}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const DocsNavLink = ({
  active,
  item,
  onNavigate,
}: {
  readonly active: boolean;
  readonly item: DocsNavItem;
  readonly onNavigate?: () => void;
}) => (
  <DocsLink
    aria-current={active ? "page" : undefined}
    className="avon-docs-nav-link"
    href={docsPagePath(item.slug)}
    onClick={onNavigate}
  >
    {item.title}
  </DocsLink>
);
