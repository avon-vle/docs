import { useCallback, useState } from "react";
import { Check, Copy } from "lucide";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useDocsTheme } from "../context/DocsThemeContext";
import { renderLucideNodes } from "../lib/icons";

const languageLabels: Record<string, string> = {
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  zsh: "Shell",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  md: "Markdown",
  markdown: "Markdown",
  yaml: "YAML",
  yml: "YAML",
  toml: "TOML",
  sql: "SQL",
  env: "Env",
  dotenv: "Env",
  text: "Text",
  plaintext: "Text",
  diff: "Diff",
  css: "CSS",
  html: "HTML",
};

const monoFont =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const baseShell = (color: string) =>
  ({
    'code[class*="language-"]': {
      color,
      background: "transparent",
      fontFamily: monoFont,
      fontSize: "0.8125rem",
      lineHeight: "1.65",
      textShadow: "none",
    },
    'pre[class*="language-"]': {
      color,
      background: "transparent",
      margin: 0,
      padding: 0,
      overflow: "visible",
      textShadow: "none",
    },
    bold: { fontWeight: "bold" },
    italic: { fontStyle: "italic" },
  }) as const;

/** Light syntax palette (readable on stone-ish panels). */
const avonCodeThemeLight = {
  ...baseShell("#1c1917"),
  comment: { color: "#78716c" },
  prolog: { color: "#78716c" },
  doctype: { color: "#78716c" },
  cdata: { color: "#78716c" },
  punctuation: { color: "#57534e" },
  property: { color: "#0369a1" },
  tag: { color: "#0369a1" },
  boolean: { color: "#7c3aed" },
  number: { color: "#7c3aed" },
  constant: { color: "#7c3aed" },
  symbol: { color: "#7c3aed" },
  deleted: { color: "#b91c1c" },
  selector: { color: "#15803d" },
  "attr-name": { color: "#15803d" },
  string: { color: "#0369a1" },
  char: { color: "#0369a1" },
  builtin: { color: "#6d28d9" },
  inserted: { color: "#15803d" },
  operator: { color: "#57534e" },
  entity: { color: "#1c1917" },
  url: { color: "#0369a1" },
  ".language-css .token.string": { color: "#0369a1" },
  ".style .token.string": { color: "#0369a1" },
  atrule: { color: "#6d28d9" },
  "attr-value": { color: "#0369a1" },
  keyword: { color: "#6d28d9" },
  function: { color: "#4338ca" },
  className: { color: "#b45309" },
  "class-name": { color: "#b45309" },
  regex: { color: "#b45309" },
  important: { color: "#b91c1c", fontWeight: "bold" },
  variable: { color: "#1c1917" },
  parameter: { color: "#1c1917" },
  plain: { color: "#1c1917" },
} as const;

/** Dark syntax palette (docs.x.ai-style terminal). */
const avonCodeThemeDark = {
  ...baseShell("#e7e5e4"),
  comment: { color: "#78716c" },
  prolog: { color: "#78716c" },
  doctype: { color: "#78716c" },
  cdata: { color: "#78716c" },
  punctuation: { color: "#a8a29e" },
  property: { color: "#93c5fd" },
  tag: { color: "#93c5fd" },
  boolean: { color: "#c4b5fd" },
  number: { color: "#c4b5fd" },
  constant: { color: "#c4b5fd" },
  symbol: { color: "#c4b5fd" },
  deleted: { color: "#fca5a5" },
  selector: { color: "#86efac" },
  "attr-name": { color: "#86efac" },
  string: { color: "#7dd3fc" },
  char: { color: "#7dd3fc" },
  builtin: { color: "#c4b5fd" },
  inserted: { color: "#86efac" },
  operator: { color: "#a8a29e" },
  entity: { color: "#e7e5e4" },
  url: { color: "#7dd3fc" },
  ".language-css .token.string": { color: "#7dd3fc" },
  ".style .token.string": { color: "#7dd3fc" },
  atrule: { color: "#c4b5fd" },
  "attr-value": { color: "#7dd3fc" },
  keyword: { color: "#c4b5fd" },
  function: { color: "#a5b4fc" },
  className: { color: "#fcd34d" },
  "class-name": { color: "#fcd34d" },
  regex: { color: "#fcd34d" },
  important: { color: "#fca5a5", fontWeight: "bold" },
  variable: { color: "#e7e5e4" },
  parameter: { color: "#e7e5e4" },
  plain: { color: "#e7e5e4" },
} as const;

const normalizeLanguage = (language: string): string => {
  const key = language.toLowerCase();

  if (key === "ts") {
    return "typescript";
  }

  if (key === "js") {
    return "javascript";
  }

  if (key === "yml") {
    return "yaml";
  }

  if (key === "env" || key === "dotenv") {
    return "bash";
  }

  if (key === "sh" || key === "shell" || key === "zsh") {
    return "bash";
  }

  return key || "text";
};

const displayLanguage = (language: string): string => {
  const key = language.toLowerCase() || "text";
  return languageLabels[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
};

export const DocsCodeBlock = ({
  code,
  language,
}: {
  readonly code: string;
  readonly language: string;
}) => {
  const { resolvedTheme } = useDocsTheme();
  const dark = resolvedTheme === "dark";
  const [copied, setCopied] = useState(false);
  const prismLanguage = normalizeLanguage(language);
  const label = displayLanguage(language);
  const theme = dark ? avonCodeThemeDark : avonCodeThemeLight;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }, [code]);

  return (
    <div
      className={`avon-docs-codeblock${dark ? " avon-docs-codeblock--dark" : " avon-docs-codeblock--light"}`}
    >
      <div className="avon-docs-codeblock__header">
        <span className="avon-docs-codeblock__lang">{label}</span>
        <button
          aria-label={copied ? "Copied" : "Copy code"}
          className="avon-docs-codeblock__copy"
          onClick={() => {
            void copy();
          }}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {renderLucideNodes(copied ? Check : Copy)}
          </svg>
        </button>
      </div>
      <div className="avon-docs-codeblock__body">
        <SyntaxHighlighter
          PreTag="div"
          codeTagProps={{
            style: {
              fontFamily: monoFont,
              fontSize: "0.8125rem",
              lineHeight: "1.65",
            },
          }}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: 0,
          }}
          language={prismLanguage}
          style={theme}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
