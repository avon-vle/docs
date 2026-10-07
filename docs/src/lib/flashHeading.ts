const FLASH_CLASS = "avon-docs-heading-flash";

/** Briefly flash a heading (and its in-page anchor) with the theme accent blue. */
export function flashHeading(id: string): void {
  const target = document.getElementById(id);

  if (target === null) {
    return;
  }

  target.classList.remove(FLASH_CLASS);
  // Restart CSS animation if the same heading is clicked again.
  void target.offsetWidth;
  target.classList.add(FLASH_CLASS);

  const clear = () => {
    target.classList.remove(FLASH_CLASS);
    target.removeEventListener("animationend", clear);
  };

  target.addEventListener("animationend", clear);
}

export function scrollToHeadingAndFlash(id: string): void {
  const target = document.getElementById(id);

  if (target === null) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  const path = `${window.location.pathname}${window.location.search}#${id}`;
  window.history.replaceState(null, "", path);
  flashHeading(id);
}
