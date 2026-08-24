/**
 * Canonical origin for metadata, sitemap and robots.
 *
 * govivo.ai 308-redirects to www.govivo.ai, so the www host is the canonical
 * one — anything we emit (canonical links, OG urls, sitemap entries) has to
 * match it or Google sees two hosts for the same page.
 */
const RAW = process.env.NEXT_PUBLIC_SITE_URL || "https://www.govivo.ai";

export const SITE_URL = RAW.replace(/\/+$/, "").replace(/^https?:\/\/govivo\.ai/, "https://www.govivo.ai");

export const OG_IMAGE = "/photos/hero-banner.png";
