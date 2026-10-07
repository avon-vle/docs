/**
 * Freeze background scroll without changing layout.
 *
 * Do not toggle `overflow` / padding on `html`/`body` — that unsticks
 * sidebars and shifts the page under the search overlay. Instead, block
 * wheel/touch scrolling on the document while allowing nested
 * `[data-allow-scroll]` regions (e.g. search results) to scroll.
 */
export function preventBackgroundScroll(): () => void {
  const onWheel = (event: WheelEvent) => {
    if (isInsideScrollableRegion(event.target)) {
      return;
    }

    event.preventDefault();
  };

  const onTouchMove = (event: TouchEvent) => {
    if (isInsideScrollableRegion(event.target)) {
      return;
    }

    event.preventDefault();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    // Stop page scroll keys when focus is not in a scrollable region.
    const keys = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);

    if (!keys.has(event.key)) {
      return;
    }

    if (isInsideScrollableRegion(event.target)) {
      return;
    }

    // Allow typing space in the search input.
    if (
      event.key === " " &&
      event.target instanceof HTMLElement &&
      (event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable)
    ) {
      return;
    }

    event.preventDefault();
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("keydown", onKeyDown);
  };
}

/**
 * Mobile fullscreen nav still needs overflow lock (it owns the viewport).
 * Prefer this only when the whole page is covered by a drawer.
 */
export function lockBodyScroll(): () => void {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  const previous = {
    htmlOverflow: document.documentElement.style.overflow,
    bodyOverflow: document.body.style.overflow,
    bodyPaddingRight: document.body.style.paddingRight,
  };

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  return () => {
    document.documentElement.style.overflow = previous.htmlOverflow;
    document.body.style.overflow = previous.bodyOverflow;
    document.body.style.paddingRight = previous.bodyPaddingRight;
  };
}

function isInsideScrollableRegion(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest("[data-allow-scroll]") !== null;
}
