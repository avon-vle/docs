import { createElement, type SVGProps } from "react";
import type { IconNode } from "lucide";

type LucideAttributes = SVGProps<SVGElement> & {
  readonly key?: string;
};

export const renderLucideNodes = (icon: IconNode) =>
  icon.map(([tag, attrs], index) =>
    createElement(tag, {
      ...(attrs as LucideAttributes),
      key: (attrs as LucideAttributes).key ?? `${tag}-${index}`,
    }),
  );
