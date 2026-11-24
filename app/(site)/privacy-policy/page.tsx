import { LegalPage, legalMetadata } from "@/components/site/LegalPage";

export const dynamic = "force-dynamic";
export const metadata = legalMetadata("privacy-policy");

export default function Page() {
  return <LegalPage slug="privacy-policy" />;
}
