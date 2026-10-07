import {
  BookOpen,
  ClipboardCheck,
  FolderGit2,
  GraduationCap,
  Lightbulb,
  MessageSquareText,
  Plug,
  Rocket,
  Settings2,
  Wrench,
} from "lucide";
import { devWelcomeCard } from "virtual:dev-docs";
import { useDocsTheme } from "../context/DocsThemeContext";
import { renderLucideNodes } from "../lib/icons";
import { docsPagePath } from "../lib/routes";
import { DocsLink } from "./DocsLink";

type WelcomeCard = {
  readonly description: string;
  readonly href: string;
  readonly icon: typeof Rocket;
  readonly title: string;
};

const startHereCards: readonly WelcomeCard[] = [
  {
    description:
      "What Avon does for CS courses, who it’s for, and how to get started.",
    href: docsPagePath("what-is-avon"),
    icon: Rocket,
    title: "What is Avon",
  },
  {
    description:
      "Launches from the VLE, staff vs student views, and course activities.",
    href: docsPagePath("concepts"),
    icon: Lightbulb,
    title: "How Avon works",
  },
  {
    description:
      "Register Avon on Moodle, Canvas, and other LTI 1.3 platforms.",
    href: docsPagePath("integrate/lms"),
    icon: Plug,
    title: "Connect your VLE",
  },
];

const whatYouCanDoCards: readonly WelcomeCard[] = [
  {
    description: "Turn one template into private student or team repositories.",
    href: docsPagePath("product/provision"),
    icon: FolderGit2,
    title: "Provision repos",
  },
  {
    description: "Autograding and feedback next to the coursework activity.",
    href: docsPagePath("product/test"),
    icon: ClipboardCheck,
    title: "Testing & feedback",
  },
  {
    description: "Hints and review help kept with a specific submission.",
    href: docsPagePath("product/suggest"),
    icon: MessageSquareText,
    title: "Review suggestions",
  },
  {
    description: "Mark work and send grades back to the learning platform.",
    href: docsPagePath("product/assess"),
    icon: BookOpen,
    title: "Grades & assessment",
  },
  {
    description: "How staff and students use Avon from inside the course.",
    href: docsPagePath("integrate/lms"),
    icon: GraduationCap,
    title: "Learning platforms",
  },
  {
    description:
      "Tool URLs, launch behaviour, and content selection for admins.",
    href: docsPagePath("integrate/lti"),
    icon: Settings2,
    title: "LTI setup",
  },
];

const byRoleCards: readonly WelcomeCard[] = [
  {
    description:
      "Plan a module, place activities, and see what students open from the VLE.",
    href: docsPagePath("what-is-avon"),
    icon: GraduationCap,
    title: "Course teams",
  },
  {
    description:
      "Register the external tool, check launches, and wire grade services.",
    href: docsPagePath("integrate/lti"),
    icon: Settings2,
    title: "Platform admins",
  },
  {
    description:
      "Open Avon from your course activity - no separate Avon password.",
    href: docsPagePath("concepts"),
    icon: BookOpen,
    title: "Students",
  },
];

const localDevCard: WelcomeCard | null =
  devWelcomeCard === null
    ? null
    : {
        description: devWelcomeCard.description,
        href: docsPagePath(devWelcomeCard.slug),
        icon: Wrench,
        title: devWelcomeCard.title,
      };

/** Construction hard hat - classic safety yellow. */
const HardHat = () => (
  <svg
    aria-hidden="true"
    className="avon-docs-welcome-hat-svg"
    fill="none"
    viewBox="0 0 96 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="48" cy="56" fill="currentColor" opacity="0.1" rx="36" ry="5" />
    <path
      d="M8 46c6-4 18-7 40-7s34 3 40 7c-4 5-18 10-40 10S12 51 8 46Z"
      fill="#f5c518"
    />
    <path
      d="M14 45c5-2.5 15-4.5 34-4.5s29 2 34 4.5"
      opacity="0.35"
      stroke="#fff8c8"
      strokeLinecap="round"
      strokeWidth="2"
    />
    <path d="M20 44c2-18 12-30 28-30s26 12 28 30H20Z" fill="#f5c518" />
    <path
      d="M48 16v28"
      opacity="0.45"
      stroke="#fff8c8"
      strokeLinecap="round"
      strokeWidth="4"
    />
    <path
      d="M30 28c4-8 10-12 18-12"
      opacity="0.5"
      stroke="#fff8c8"
      strokeLinecap="round"
      strokeWidth="3"
    />
  </svg>
);

const WelcomeCardLink = ({ card }: { readonly card: WelcomeCard }) => (
  <DocsLink className="avon-docs-welcome-card" href={card.href}>
    <span className="avon-docs-welcome-card-head">
      <span className="avon-docs-welcome-card-icon" aria-hidden="true">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.75"
          viewBox="0 0 24 24"
        >
          {renderLucideNodes(card.icon)}
        </svg>
      </span>
      <span className="avon-docs-welcome-card-title">{card.title}</span>
    </span>
    <span className="avon-docs-welcome-card-body">
      <span className="avon-docs-welcome-card-desc">{card.description}</span>
    </span>
  </DocsLink>
);

const CardSection = ({
  cards,
  label,
  title,
}: {
  readonly cards: readonly WelcomeCard[];
  readonly label: string;
  readonly title: string;
}) => (
  <section aria-label={label} className="avon-docs-welcome-section">
    <h2 className="avon-docs-welcome-section-title">{title}</h2>
    <div className="avon-docs-welcome-grid">
      {cards.map((card) => (
        <WelcomeCardLink
          card={card}
          key={`${title}-${card.href}-${card.title}`}
        />
      ))}
    </div>
  </section>
);

export const DocsWelcome = () => {
  const { resolvedTheme } = useDocsTheme();
  const logoClassName =
    resolvedTheme === "dark" ? "brightness-0 invert" : "brightness-0";
  const startCards = localDevCard
    ? [...startHereCards, localDevCard]
    : startHereCards;

  return (
    <div className="avon-docs-welcome">
      <section className="avon-docs-welcome-hero">
        <div className="avon-docs-welcome-hero-copy">
          <h1 className="avon-docs-welcome-title">Get started with Avon</h1>
          <p className="avon-docs-welcome-lede">
            Docs for course teams and platform admins using Avon - how it fits
            your VLE, what students see, and what each product area is for.
          </p>
        </div>

        <div
          className="avon-docs-welcome-mascot-wrap"
          title="Avon logo with hard hat"
        >
          <div className="avon-docs-welcome-mascot-bob">
            <div className="avon-docs-welcome-logo-stack">
              <span aria-hidden="true" className="avon-docs-welcome-hat">
                <HardHat />
              </span>
              <img
                alt=""
                className={`avon-docs-welcome-logo ${logoClassName}`}
                height={416}
                src="/avon-logo.svg"
                width={705}
              />
            </div>
          </div>
        </div>
      </section>

      <CardSection cards={startCards} label="Start here" title="Start here" />

      <CardSection
        cards={whatYouCanDoCards}
        label="What you can do with Avon"
        title="What you can do with Avon"
      />

      <CardSection
        cards={byRoleCards}
        label="Browse by role"
        title="Browse by role"
      />

      <p className="avon-docs-welcome-foot">
        Prefer the keyboard? Hit <kbd className="avon-docs-welcome-kbd">⌘K</kbd>{" "}
        / <kbd className="avon-docs-welcome-kbd">Ctrl+K</kbd> to search, or{" "}
        <kbd className="avon-docs-welcome-kbd">/</kbd> when you’re not typing.
      </p>
    </div>
  );
};
