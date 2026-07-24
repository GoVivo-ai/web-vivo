import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollFx } from "../ScrollFx";
import { RevealObserver } from "../RevealObserver";
import { GsapFx } from "../fx/GsapFx";
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
      <RevealObserver />
      <GsapFx />
      <Header settings={settings} activeGroup={activeGroup} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
