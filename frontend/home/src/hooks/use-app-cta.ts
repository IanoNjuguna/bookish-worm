import { useLocation } from "react-router-dom";
import { dobaApp, papsApp } from "@/lib/site";

export interface AppCtaLink {
  label: string;
  href: string;
}

export interface UseAppCtaReturn {
  /**
   * One CTA per app the current page is about. Two on the house, because there the
   * reader has not told us which app they want yet.
   */
  links: AppCtaLink[];
}

const DOBA: AppCtaLink = { label: "Open doba", href: dobaApp };
const PAPS: AppCtaLink = { label: "Open paps", href: papsApp };

/**
 * The CTA follows the route instead of pointing at one global app. Every page other
 * than /paps is about doba music, so it gets "Open doba"; the house gets both, since
 * guessing there would be choosing for the reader.
 */
export function useAppCta(): UseAppCtaReturn {
  const { pathname } = useLocation();
  // /paps and /paps/ are the same page to a visitor and to react-router's matching,
  // so they must be the same page here too.
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/paps") return { links: [PAPS] };
  if (path === "/") {
    return {
      links: [
        { label: "doba app", href: dobaApp },
        { label: "paps app", href: papsApp },
      ],
    };
  }
  return { links: [DOBA] };
}
