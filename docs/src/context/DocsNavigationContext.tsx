import { createContext, useContext, type ReactNode } from "react";
import type { DocsRoute } from "../lib/routes";

type DocsNavigationValue = {
  readonly navigate: (path: string) => void;
  readonly pathname: string;
  readonly route: DocsRoute;
};

const DocsNavigationContext = createContext<DocsNavigationValue | null>(null);

export const DocsNavigationProvider = ({
  children,
  value,
}: {
  readonly children: ReactNode;
  readonly value: DocsNavigationValue;
}) => (
  <DocsNavigationContext.Provider value={value}>
    {children}
  </DocsNavigationContext.Provider>
);

export const useDocsNavigation = () => {
  const context = useContext(DocsNavigationContext);

  if (context === null) {
    throw new Error(
      "useDocsNavigation must be used within DocsNavigationProvider",
    );
  }

  return context;
};
