import { describe, expect, it } from "vitest";
import {
  buildDocsLlmMarkdown,
  buildDocsRawMarkdown,
} from "../src/lib/docsExport";

const page = {
  description: "Roles and handoffs.",
  slug: "concepts",
  title: "Concepts",
} as const;

const body = "## Roles\n\nLTI carries platform roles.\n";

describe("docsExport", () => {
  it("builds LLM markdown with title, description, and body", () => {
    const md = buildDocsLlmMarkdown(page, body, "https://docs.example");
    expect(md).toContain("# Concepts");
    expect(md).toContain("Roles and handoffs.");
    expect(md).toContain("`/concepts`");
    expect(md).toContain("https://docs.example/concepts");
    expect(md).toContain("## Roles");
  });

  it("builds raw markdown for viewing", () => {
    const md = buildDocsRawMarkdown(page, body);
    expect(md.startsWith("# Concepts")).toBe(true);
    expect(md).toContain("_Roles and handoffs._");
    expect(md).toContain("## Roles");
  });
});
