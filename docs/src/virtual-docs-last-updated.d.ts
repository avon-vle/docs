declare module "virtual:docs-last-updated" {
  /** slug → ISO 8601 last-commit (or mtime) timestamp */
  export const lastUpdatedBySlug: Readonly<Record<string, string>>;
}
