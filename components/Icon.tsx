import { icons, type LucideProps } from "lucide-react";

/** Lucide renamed several icons in v1; keep the old kebab names working. */
const ALIASES: Record<string, string> = {
  "bar-chart-3": "ChartColumn",
  "bar-chart-2": "ChartNoAxesColumn",
  "bar-chart": "ChartNoAxesColumnIncreasing",
  "line-chart": "ChartLine",
  "pie-chart": "ChartPie",
  "alert-triangle": "TriangleAlert",
  "alert-circle": "CircleAlert",
  "alert-octagon": "OctagonAlert",
  "check-circle": "CircleCheck",
  "check-circle-2": "CircleCheckBig",
  "x-circle": "CircleX",
  "help-circle": "CircleHelp",
  "more-horizontal": "Ellipsis",
  "more-vertical": "EllipsisVertical",
};

/** Kebab-case Lucide name (matches the design's data-lucide values) → React icon. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const pascal =
    ALIASES[name] ??
    name
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("");
  const Cmp = (icons as Record<string, React.ComponentType<LucideProps>>)[pascal];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
