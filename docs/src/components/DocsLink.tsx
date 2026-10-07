import {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useDocsNavigation } from "../context/DocsNavigationContext";
import { isInternalDocsPath } from "../lib/routes";

export const DocsLink = forwardRef<
  HTMLAnchorElement,
  {
    readonly children: ReactNode;
    readonly href: string;
  } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">
>(function DocsLink({ children, href, onClick, ...props }, ref) {
  const { navigate } = useDocsNavigation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || !isInternalDocsPath(href)) {
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} ref={ref} {...props}>
      {children}
    </a>
  );
});
