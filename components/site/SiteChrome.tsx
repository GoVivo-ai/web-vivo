import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollFx } from "../ScrollFx";
import type { SiteSettings } from "@/lib/blocks/types";

export function SiteChrome({
  settings,
  activeGroup,
  children,
}: {
  settings: SiteSettings;
  activeGroup: string | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollFx />
      <Header settings={settings} activeGroup={activeGroup} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
