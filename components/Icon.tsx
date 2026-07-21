import { icons, type LucideProps } from "lucide-react";

/** Kebab-case Lucide name (matches the design's data-lucide values) → React icon. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const pascal = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const Cmp = (icons as Record<string, React.ComponentType<LucideProps>>)[pascal];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
