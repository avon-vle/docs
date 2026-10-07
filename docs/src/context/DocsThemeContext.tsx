import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DocsThemeMode = "light" | "dark" | "system";
export type DocsResolvedTheme = "light" | "dark";

type DocsThemeContextValue = {
  readonly mode: DocsThemeMode;
  readonly resolvedTheme: DocsResolvedTheme;
  readonly setMode: (mode: DocsThemeMode) => void;
};

/** Shared with the marketing site so theme preference carries across origins on the same browser profile when desired. */
const THEME_STORAGE_KEY = "avon.website.theme";

const DocsThemeContext = createContext<DocsThemeContextValue | null>(null);

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const isThemeMode = (value: string | null): value is DocsThemeMode =>
  value === "light" || value === "dark" || value === "system";

const getSystemTheme = (): DocsResolvedTheme => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

const getInitialMode = (): DocsThemeMode => {
  if (typeof window === "undefined") {
    return "system";
  }

  if (typeof window.localStorage.getItem !== "function") {
    return "system";
  }

  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedMode) ? storedMode : "system";
};

const applyDocumentTheme = (
  mode: DocsThemeMode,
  resolvedTheme: DocsResolvedTheme,
) => {
  const root = document.documentElement;
  const themeColor = document.getElementById("avon-theme-color");
  const dark = resolvedTheme === "dark";
  const paint = dark ? "#111318" : "#fafaf9";

  root.dataset.avonTheme = mode;
  root.dataset.avonResolvedTheme = resolvedTheme;
  root.classList.toggle("avon-theme-dark", dark);
  root.classList.toggle("avon-theme-light", !dark);
  root.style.setProperty("--avon-page-bg", paint);
  root.style.setProperty("--avon-docs-paint-bg", paint);

  if (themeColor) {
    themeColor.setAttribute("content", paint);
  }
};

export const DocsThemeProvider = ({
  children,
}: {
  readonly children: ReactNode;
}) => {
  const [mode, setModeState] = useState<DocsThemeMode>(getInitialMode);
  const [systemTheme, setSystemTheme] =
    useState<DocsResolvedTheme>(getSystemTheme);
  const resolvedTheme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    applyDocumentTheme(mode, resolvedTheme);
  }, [mode, resolvedTheme]);

  const value = useMemo<DocsThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      setMode: (nextMode) => {
        if (typeof window.localStorage.setItem === "function") {
          window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
        }

        setModeState(nextMode);
      },
    }),
    [mode, resolvedTheme],
  );

  return (
    <DocsThemeContext.Provider value={value}>
      {children}
    </DocsThemeContext.Provider>
  );
};

export const useDocsTheme = () => {
  const context = useContext(DocsThemeContext);

  if (context === null) {
    throw new Error("useDocsTheme must be used within DocsThemeProvider");
  }

  return context;
};
