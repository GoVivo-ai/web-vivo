"use client";

/**
 * "Cookie Settings" and "Your Privacy Choices" both reopen the consent
 * manager's preferences panel. Until the CMP (CookieYes) is installed there is
 * no panel to open, so the button falls back to the Cookie Policy.
 */
export function PrivacyChoicesButton({ label }: { label: string }) {
  function open() {
    const w = window as unknown as { revisitCkyConsent?: () => void };
    if (typeof w.revisitCkyConsent === "function") w.revisitCkyConsent();
    else window.location.href = "/cookie-policy";
  }
  return (
    <button type="button" onClick={open}>
      {label}
    </button>
  );
}
