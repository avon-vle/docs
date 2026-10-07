import { devDocsNav } from "virtual:dev-docs";

export type DocsProductId = "docs" | "help" | "cli";

export type DocsNavItem = {
  readonly description: string;
  readonly slug: string;
  readonly title: string;
};

export type DocsNavSection = {
  readonly items: readonly DocsNavItem[];
  readonly title: string;
};

export type DocsNavGroup = {
  readonly items: readonly DocsNavItem[];
  /** Developer group from `src/dev` - badged "Local" in the sidebar. */
  readonly localOnly?: boolean;
  /** Which product area this group belongs to (sidebar + top switcher). */
  readonly product: DocsProductId;
  /** Optional collapsible areas for larger documentation groups. */
  readonly sections?: readonly DocsNavSection[];
  readonly title: string;
};

export type DocsProduct = {
  readonly description: string;
  readonly homeSlug: string;
  readonly id: DocsProductId;
  readonly label: string;
};

/** Top-left product switcher: Docs / Help / CLI. */
export const docsProducts: readonly DocsProduct[] = [
  {
    description: "Product guides for course teams and platform admins.",
    homeSlug: "",
    id: "docs",
    label: "Docs",
  },
  {
    description: "FAQ, contact, and getting unstuck.",
    homeSlug: "help",
    id: "help",
    label: "Help",
  },
  {
    description: "Install and use the Avon command-line tools.",
    homeSlug: "cli",
    id: "cli",
    label: "CLI",
  },
] as const;

/** Public sidebar IA. Course-facing groups first. */
const publicDocsNav: readonly DocsNavGroup[] = [
  {
    product: "docs",
    title: "Get started",
    items: [
      {
        description: "Pick a path into the docs for your course or platform.",
        slug: "",
        title: "Welcome",
      },
      {
        description:
          "What Avon does for CS courses, who it’s for, and how to get started.",
        slug: "what-is-avon",
        title: "What is Avon",
      },
      {
        description:
          "Launches from the VLE, staff vs student views, and course activities.",
        slug: "concepts",
        title: "How Avon works",
      },
    ],
  },
  {
    product: "docs",
    title: "Product",
    items: [
      {
        description:
          "From one template to private student or team repositories.",
        slug: "product/provision",
        title: "Provisioning repos",
      },
      {
        description:
          "Autograding and feedback next to the coursework activity.",
        slug: "product/test",
        title: "Testing & feedback",
      },
      {
        description: "Hints and review help kept with a specific submission.",
        slug: "product/suggest",
        title: "Review suggestions",
      },
      {
        description:
          "Marking work and sending grades back to the learning platform.",
        slug: "product/assess",
        title: "Grades & assessment",
      },
    ],
  },
  {
    product: "docs",
    title: "Platforms",
    items: [
      {
        description:
          "Using Avon from Moodle, Canvas, and other university VLEs.",
        slug: "integrate/lms",
        title: "Learning platforms",
      },
      {
        description:
          "Register Avon as an external tool; how launch and content selection behave.",
        slug: "integrate/lti",
        title: "LTI setup",
      },
      {
        description:
          "Connect GitLab and GitHub so courses can provision and open real repositories.",
        slug: "integrate/forge",
        title: "Git forge connections",
      },
      {
        description:
          "Enterprise Cloud Apps, school organisations under enterprise hubs, multi-enterprise.",
        slug: "integrate/github-enterprise",
        title: "GitHub Enterprise Apps",
      },
      {
        description:
          "GitLab group connections, hierarchical allowed namespaces, create subgroup.",
        slug: "integrate/gitlab-groups",
        title: "GitLab groups",
      },
    ],
  },
  {
    product: "help",
    title: "Help",
    items: [
      {
        description: "Help home - FAQ, contact, and where to start.",
        slug: "help",
        title: "Help center",
      },
      {
        description: "Common questions about launches, grades, and accounts.",
        slug: "help/faq",
        title: "FAQ",
      },
      {
        description: "Who to contact for course, platform, or product support.",
        slug: "help/contact",
        title: "Contact",
      },
    ],
  },
  {
    product: "cli",
    title: "CLI",
    items: [
      {
        description:
          "What the Avon CLI is for and how this section is organised.",
        slug: "cli",
        title: "Overview",
      },
      {
        description: "Install the CLI on your machine.",
        slug: "cli/install",
        title: "Install",
      },
      {
        description: "Main commands and how to get per-command help.",
        slug: "cli/commands",
        title: "Commands",
      },
    ],
  },
];

/**
 * Developer groups come from `virtual:dev-docs`, which is only populated by
 * `vite dev` (see vite.config.ts), so production builds never contain them.
 */
export const docsNav: readonly DocsNavGroup[] = [
  ...publicDocsNav,
  ...devDocsNav,
];

export const navItemsForGroup = (
  group: DocsNavGroup,
): readonly DocsNavItem[] => [
  ...group.items,
  ...(group.sections?.flatMap((section) => section.items) ?? []),
];

const docsBySlug = new Map(
  docsNav.flatMap((group) =>
    navItemsForGroup(group).map((item) => [
      item.slug,
      {
        item,
        product: group.product,
      },
    ]),
  ),
);

export const defaultDocsSlug = "" as const;

export function getDocsPage(slug: string): DocsNavItem | null {
  return docsBySlug.get(slug)?.item ?? null;
}

export function getDocsProductId(slug: string): DocsProductId {
  const fromNav = docsBySlug.get(slug)?.product;
  if (fromNav !== undefined) {
    return fromNav;
  }

  if (slug === "help" || slug.startsWith("help/")) {
    return "help";
  }

  if (slug === "cli" || slug.startsWith("cli/")) {
    return "cli";
  }

  return "docs";
}

export function getDocsProduct(id: DocsProductId): DocsProduct {
  const product = docsProducts.find((entry) => entry.id === id);
  if (product === undefined) {
    return docsProducts[0]!;
  }

  return product;
}

/** Sidebar groups for the active product area. */
export function visibleNavForProduct(
  product: DocsProductId,
): readonly DocsNavGroup[] {
  return docsNav.filter((group) => group.product === product);
}

export function normalizeDocsSlug(slug: string | undefined): string {
  if (slug === undefined || slug === "" || slug === "introduction") {
    return defaultDocsSlug;
  }

  return slug.replace(/^\/+|\/+$/gu, "");
}

export function isWelcomeSlug(slug: string): boolean {
  return slug === defaultDocsSlug;
}
