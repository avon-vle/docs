import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";
import { resolveDocsRoute } from "../src/lib/routes";

describe("@avon/docs", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("resolves docs routes from the path root", () => {
    expect(resolveDocsRoute("/")).toEqual({ kind: "docs", slug: "" });
    expect(resolveDocsRoute("/integrate/lti")).toEqual({
      kind: "docs",
      slug: "integrate/lti",
    });
    expect(resolveDocsRoute("/product/provision")).toEqual({
      kind: "docs",
      slug: "product/provision",
    });
  });

  it("renders the welcome page and navigates into docs", () => {
    render(<App />);

    expect(screen.getByRole("main", { name: "Documentation" })).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Get started with Avon" }),
    ).toBeTruthy();
    const docsNav = () =>
      screen.getByRole("navigation", { name: "Documentation" });

    fireEvent.click(
      within(docsNav()).getByRole("link", { name: "What is Avon" }),
    );

    expect(
      screen.getByRole("heading", { name: "What is Avon", level: 1 }),
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Who this is for" }),
    ).toBeTruthy();
  });
});
