import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "../lib/docsContent";
import { isInternalDocsPath } from "../lib/routes";
import { DocsCodeBlock } from "./DocsCodeBlock";
import { DocsLink } from "./DocsLink";

const components: Components = {
  a: ({ href, children }) => {
    if (href === undefined || href.length === 0) {
      return <span>{children}</span>;
    }

    if (isInternalDocsPath(href)) {
      return (
        <DocsLink className="avon-docs-link" href={href}>
          {children}
        </DocsLink>
      );
    }

    return (
      <a
        className="avon-docs-link"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  },
  h2: ({ children }) => {
    const text = headingText(children);
    const id = slugifyHeading(text);

    return (
      <h2 id={id}>
        <a className="avon-docs-heading-anchor" href={`#${id}`}>
          {children}
        </a>
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = headingText(children);
    const id = slugifyHeading(text);

    return (
      <h3 id={id}>
        <a className="avon-docs-heading-anchor" href={`#${id}`}>
          {children}
        </a>
      </h3>
    );
  },
  // Fence blocks: react-markdown nests <code> inside <pre>. Unwrap pre and
  // render a chrome window from the code node (or plain pre fallback).
  pre: ({ children }) => {
    const codeChild = Array.isArray(children) ? children[0] : children;

    if (
      codeChild !== null &&
      typeof codeChild === "object" &&
      "props" in codeChild
    ) {
      const props = codeChild.props as {
        readonly className?: string;
        readonly children?: unknown;
      };
      const className = props.className ?? "";
      const match = /language-([\w-]+)/u.exec(className);
      const language = match?.[1] ?? "text";
      const code = String(props.children ?? "").replace(/\n$/u, "");

      return <DocsCodeBlock code={code} language={language} />;
    }

    return <pre>{children}</pre>;
  },
  code: ({ className, children }) => {
    // Inline code only - fenced blocks are handled by `pre`.
    if (className?.includes("language-")) {
      return <code className={className}>{children}</code>;
    }

    return <code className="avon-docs-inline-code">{children}</code>;
  },
};

export const DocsMarkdown = ({ content }: { readonly content: string }) => (
  <div className="avon-docs-article">
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  </div>
);

function headingText(children: unknown): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(headingText).join("");
  }

  if (
    children !== null &&
    typeof children === "object" &&
    "props" in children &&
    children.props !== null &&
    typeof children.props === "object" &&
    "children" in children.props
  ) {
    return headingText(
      (children.props as { readonly children?: unknown }).children,
    );
  }

  return "";
}
