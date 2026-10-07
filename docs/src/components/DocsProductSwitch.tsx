import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide";
import {
  docsProducts,
  getDocsProduct,
  type DocsProductId,
} from "../content/docsNav";
import { renderLucideNodes } from "../lib/icons";
import { docsPagePath } from "../lib/routes";
import { DocsLink } from "./DocsLink";

export const DocsProductSwitch = ({
  productId,
}: {
  readonly productId: DocsProductId;
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();
  const current = getDocsProduct(productId);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (
        rootRef.current !== null &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="avon-docs-product-switch" ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className="avon-docs-product-switch-trigger"
        onClick={() => {
          setOpen((value) => !value);
        }}
        type="button"
      >
        <span className="avon-docs-product-switch-label">{current.label}</span>
        <svg
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {renderLucideNodes(ChevronDown)}
        </svg>
      </button>

      {open ? (
        <div className="avon-docs-product-switch-menu" id={menuId} role="menu">
          {docsProducts.map((product) => {
            const active = product.id === productId;

            return (
              <DocsLink
                aria-current={active ? "page" : undefined}
                className={`avon-docs-product-switch-item ${
                  active ? "avon-docs-product-switch-item--active" : ""
                }`}
                href={docsPagePath(product.homeSlug)}
                key={product.id}
                onClick={() => {
                  setOpen(false);
                }}
                role="menuitem"
              >
                <span className="avon-docs-product-switch-item-copy">
                  <span className="avon-docs-product-switch-item-title">
                    {product.label}
                  </span>
                  <span className="avon-docs-product-switch-item-desc">
                    {product.description}
                  </span>
                </span>
                {active ? (
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 text-[var(--avon-docs-accent)]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    {renderLucideNodes(Check)}
                  </svg>
                ) : null}
              </DocsLink>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
