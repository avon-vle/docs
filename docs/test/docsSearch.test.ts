import { describe, expect, it } from "vitest";
import { searchDocs } from "../src/lib/docsSearch";

describe("searchDocs", () => {
  it("returns default pages when the query is empty", () => {
    const hits = searchDocs("");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.title).toBeTruthy();
  });

  it("finds pages by title", () => {
    const hits = searchDocs("LTI");
    expect(hits.some((hit) => hit.slug === "integrate/lti")).toBe(true);
  });

  it("finds pages by body content", () => {
    const hits = searchDocs("handoff");
    expect(hits.length).toBeGreaterThan(0);
    expect(
      hits.some(
        (hit) =>
          hit.slug === "concepts" ||
          hit.slug === "integrate/lti" ||
          hit.slug === "",
      ),
    ).toBe(true);
  });
});
