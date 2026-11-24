import { LegalPage, legalMetadata } from "@/components/site/LegalPage";

export const dynamic = "force-dynamic";
export const metadata = legalMetadata("cookie-policy");

export default function Page() {
  return <LegalPage slug="cookie-policy" />;
}
