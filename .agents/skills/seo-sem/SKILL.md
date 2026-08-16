---
name: seo-sem
description: Guide SEO/SEM work for the Doba marketing site (frontend/home) and app (frontend/app), including the pre-drop strategy, metadata, structured data, sitemaps, internal linking, and prerendering.
type: prompt
whenToUse: When the user asks for SEO, SEM, pre-drop pages, metadata, structured data, sitemaps, internal links, or prerendering in this repository.
---

# SEO/SEM Skill

This skill governs how to build discoverable, indexable surfaces for Doba across the marketing site (`frontend/home`) and the app (`frontend/app`).

## Strategic framing

- Doba’s artist value prop is the **pre-drop**: artists release music on Doba before (or while waiting for) other platforms.
- Primary search personas:
  - **Artists** searching “how to release music,” “release music before Spotify,” “music pre-drop platform.”
  - **Fans/collectors** searching artist or track names plus “Doba,” “pre-drop,” or “NFT.”
- Brand terms (`doba`, `doba protocol`, `doba world`, `doba web3`, `doba NFT`) are defensive keywords; growth SEO comes from category and artist/track content.

## Architecture constraints

- `frontend/app` is **Next.js App Router** — use native SSR metadata, `metadataBase`, `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, and JSON-LD components.
- `frontend/home` is a **Vite React SPA** — crawlers may not execute JS. For real SEO it must be prerendered or migrated to Next.js. Within the SPA, use `react-helmet-async` for route-level metadata and a static `sitemap.xml` plus static JSON-LD in `index.html`.

## Page patterns

### `/pre-drop` cornerstone (home)
- H1 targets the concept: “Pre-drop your music before the streaming platforms.”
- Sections:
  1. The waitlist/funnel problem.
  2. How Doba pre-drop works (3 steps).
  3. Artist spotlight cards (Carla Alves, Gathuru Gitema, Red GG) framed as “exclusive pre-drop coming soon.”
  4. Research citations (link to `/research`).
  5. CTA to `/for-artists` or the app.

### Artist landing pages (home)
- Route: `/pre-drop/:artist-slug` (e.g., `/pre-drop/carla-alves`).
- H1: “{Artist Name} — exclusive pre-drop coming to Doba.”
- Include bio, genre, origin, release teaser, notify/follow CTA, and artist social links.
- Do not claim music is already released if it is only secured/coming soon.

### Artist profile pages (app)
- Route: `/artist/:artist-slug`.
- List upcoming releases; each track page uses `/track/[id]`.
- Schema: `MusicGroup` + `MusicRecording` with future `datePublished` where applicable.

## Metadata rules

- Every route must set `<title>` and `<meta name="description">`.
- Add Open Graph tags: `og:title`, `og:description`, `og:type`, `og:image`, `og:url`.
- Add Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- In Next.js, set `metadataBase` from `NEXT_PUBLIC_SITE_URL`.
- In the Vite SPA, use `react-helmet-async`; keep fallback tags in `index.html`.

## Structured data (JSON-LD)

- App track pages: `MusicRecording` with `byArtist`, `offers`, `image`, `url`.
- App artist pages: `MusicGroup` with `name`, `url`, `image`, `sameAs` social links.
- Home brand: static `Organization` / `WebSite` JSON-LD in `index.html`.

## URLs and links

- Slugs: lowercase, hyphenated, no trailing slashes.
- Internal links in `frontend/home`: use `react-router-dom` `<Link>`.
- Internal links in `frontend/app`: use `next/link` `<Link>`.
- External links: use `<a target="_blank" rel="noreferrer">`.
- Add `/pre-drop` links to the footer, navbar, and `/for-artists` page.

## Sitemap and robots

- `frontend/app`: create/update `app/sitemap.ts` and `app/robots.ts`.
- `frontend/home`: create a static `public/sitemap.xml` listing all static routes; reference it in `robots.txt`.

## Prerendering (home)

- Prefer `vite-plugin-prerender` or `prerender-spa-plugin`.
- List all routes: `/`, `/pre-drop`, `/for-artists`, `/research`, `/about`, `/how-it-works`, `/docs`, `/media-kit`, `/support`, `/faq`, `/terms`, `/privacy`, plus artist pre-drop pages.
- Ensure prerendered HTML contains the route’s content, metadata, and JSON-LD.

## When reviewing

Flag SEO/SEM violations as: **[seo-sem] rule broken — file:line — expected pattern**.
