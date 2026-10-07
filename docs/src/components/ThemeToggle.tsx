import { Monitor, Moon, Sun } from "lucide";
import { useDocsTheme, type DocsThemeMode } from "../context/DocsThemeContext";
import { renderLucideNodes } from "../lib/icons";

const themeOptions: readonly {
  readonly icon: typeof Sun;
  readonly label: string;
  readonly value: DocsThemeMode;
}[] = [
  { icon: Sun, label: "Light", value: "light" },
  { icon: Moon, label: "Dark", value: "dark" },
  { icon: Monitor, label: "System", value: "system" },
];

export const ThemeToggle = () => {
  const { mode, resolvedTheme, setMode } = useDocsTheme();
  const dark = resolvedTheme === "dark";

  return (
    <div
      aria-label="Theme"
      className={`inline-flex h-8 shrink-0 items-center rounded-md border p-0.5 ${
        dark
          ? "border-[var(--avon-docs-border)] bg-[var(--avon-docs-code-bg)] text-[var(--avon-docs-faint)]"
          : "border-[var(--avon-docs-border)] bg-[var(--avon-docs-surface)] text-[var(--avon-docs-muted)]"
      }`}
      role="group"
    >
      {themeOptions.map((option) => {
        const active = mode === option.value;

        return (
          <button
            aria-label={`${option.label} theme`}
            aria-pressed={active}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-[0.3rem] transition-colors ${
              active
                ? dark
                  ? "bg-[#252a33] text-[#f5f5f4]"
                  : "bg-stone-900 text-white"
                : "hover:text-[var(--avon-docs-text)]"
            }`}
            key={option.value}
            onClick={() => {
              setMode(option.value);
            }}
            title={`${option.label} theme`}
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
              {renderLucideNodes(option.icon)}
            </svg>
          </button>
        );
      })}
    </div>
  );
};
