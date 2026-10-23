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
/*
 * Points at the Pages deployment, not at `https://paps.doba.world`, because that host has no DNS
 * record yet and a hackathon submission cannot ship a CTA that resolves to nothing. Cloudflare
 * Pages only answers a custom hostname registered on the project, so the record cannot be a CNAME
 * from Spaceship alone: the domain comes back here the moment the doba.world zone exists.
 */
export const papsApp = "https://paps-3nz.pages.dev";

/** The paps app as it should read in copy, without the scheme. */
export const papsAppLabel = papsApp.replace(/^https?:\/\//, "");

/** The paps landing on this site, used for its canonical and OG URLs. */
export const papsLanding = "https://doba.world/paps";
