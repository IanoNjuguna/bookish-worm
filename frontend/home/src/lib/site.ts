/**
 * Every host and landing this site points at, in one place.
 *
 * The navbar CTA and the paps landing both used to carry their own copy of these
 * strings, and the CTA read `VITE_APP_URL` which defaulted to https://doba.world:
 * the site pointed its "Launch App" button at itself. Moving a host is now a
 * one-line change here, and no CTA can drift back to the marketing host by accident.
 */

/** The music app. */
export const dobaApp = "https://app.doba.world";

/** The paps trading app. */
export const papsApp = "https://paps.doba.world";

/** The paps landing on this site, used for its canonical and OG URLs. */
export const papsLanding = "https://doba.world/paps";
