/**
 * Consent wording, exactly as in legal v1 doc 04. Do not edit the copy here
 * without Felipe's sign-off, and bump the matching ID in lib/consent-texts.ts
 * whenever a text changes. Links to legal documents open in a new tab.
 */

function Doc({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

/** sms-v1.0 */
export const SmsConsentText = () => (
  <>
    I agree to receive text messages from Vivo about my inquiry, scheduled calls, and occasional updates about Vivo&apos;s
    services at the phone number provided. Messages may be sent using automated technology. Message frequency varies,
    typically 2 to 6 per month. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a
    condition of any purchase. See our <Doc href="/sms-terms">SMS Terms</Doc> and <Doc href="/privacy-policy">Privacy Policy</Doc>.
  </>
);

/** email-mkt-v1.0 */
export const EmailMarketingConsentText = () => (
  <>Send me Vivo insights and updates by email. You can unsubscribe at any time.</>
);

/** notice-v1.0 */
export const ContactNoticeText = () => (
  <>
    By submitting this form, you agree that Vivo may contact you by email or phone about your inquiry, as described in
    our <Doc href="/privacy-policy">Privacy Policy</Doc>.
  </>
);

/** notice-booking-v1.0 */
export const BookingNoticeText = () => (
  <>
    By booking a call, you agree that Vivo may contact you by email or phone about your call, as described in
    our <Doc href="/privacy-policy">Privacy Policy</Doc>. Scheduling is managed by our booking provider on our behalf.
  </>
);

/** careers-cv-v1.1 */
export const CareersCvText = () => (
  <>
    Include your experience and contact details only. Do not add sensitive information such as health data, religion,
    ethnic origin, political or sexual orientation, or national ID numbers.
    <span className="consent-es">
      Incluye solo tu experiencia y datos de contacto. No agregues información sensible como datos de salud, religión,
      origen étnico, orientación política o sexual, ni números de documento de identidad.
    </span>
  </>
);

/** careers-auth-v1.1 */
export const CareersAuthText = () => (
  <>
    I authorize Go Vivo Inc. to process my personal data and résumé to evaluate my application and contact me by email,
    phone, or WhatsApp during the selection process. I also authorize my data to be stored in the United States and
    accessed by the Vivo team in Latin America. I confirm I am 18 or older and that the information I share is accurate.
    I have read the <Doc href="/candidate-privacy-notice">Candidate Privacy Notice</Doc>.
    <span className="consent-es">
      Autorizo a Go Vivo Inc. a tratar mis datos personales y mi hoja de vida para evaluar mi postulación y contactarme por
      correo, teléfono o WhatsApp durante el proceso de selección. Autorizo también que mis datos se almacenen en Estados
      Unidos y sean consultados por el equipo de Vivo en Latinoamérica. Declaro que tengo 18 años o más y que la
      información que comparto es veraz. He leído el <Doc href="/candidate-privacy-notice">Aviso de Privacidad para Candidatos</Doc>.
    </span>
  </>
);

/** careers-pool-v1.1 */
export const CareersPoolText = () => (
  <>
    I authorize Vivo to keep my résumé for up to 24 months to consider me for future opportunities.
    <span className="consent-es">
      Autorizo a Vivo a conservar mi hoja de vida hasta por 24 meses para considerarme en futuras oportunidades.
    </span>
  </>
);

/** One consent checkbox: never pre-checked. */
export function ConsentCheckbox({
  id,
  name,
  required,
  children,
}: {
  id: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="consent-check">
      <input type="checkbox" id={id} name={name} value="true" required={required} />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}
