declare module "virtual:dev-docs" {
  /** Developer sidebar groups - empty outside `vite dev`. */
  export const devDocsNav: readonly import("@/content/docsNav").DocsNavGroup[];
  /** module path → raw markdown - empty outside `vite dev`. */
  export const devDocsContent: Readonly<Record<string, string>>;
  /** Welcome-page card for local setup - null outside `vite dev`. */
  export const devWelcomeCard: {
    readonly description: string;
    readonly slug: string;
    readonly title: string;
  } | null;
}
