import { LegalPage, legalMetadata } from "@/components/site/LegalPage";

export const dynamic = "force-dynamic";
export const metadata = legalMetadata("candidate-privacy-notice");

export default function Page() {
  return <LegalPage slug="candidate-privacy-notice" />;
}
