---
name: seo-sem-enforcement
description: Review SEO/SEM changes in frontend/home and frontend/app for compliance with the seo-sem skill.
type: prompt
whenToUse: When reviewing SEO/SEM-related code, pages, metadata, structured data, sitemaps, internal links, or prerendering changes in this repository.
---

# SEO/SEM Enforcement

Review SEO/SEM changes against the `seo-sem` skill. Read the relevant files and flag violations as **[seo-sem] rule broken — file:line — expected pattern**.

## Page-level checks

- [ ] Every page/route has a unique, descriptive `<title>` (≤ 60 chars ideal).
- [ ] Every page/route has a unique `<meta name="description">` (≤ 160 chars ideal).
- [ ] Open Graph tags present: `og:title`, `og:description`, `og:type`, `og:image`, `og:url`.
- [ ] Twitter Card tags present: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- [ ] Exactly one `<h1>` per page, with the primary keyword where natural.
- [ ] Heading hierarchy is logical (no `h2` under an `h4`, no skipped levels).

## URLs and slugs

- [ ] Routes use lowercase, hyphenated slugs (e.g., `/pre-drop`, `/carla-alves`).
- [ ] No trailing slashes in internal route definitions.
- [ ] Canonical URLs are absolute and consistent with `metadataBase` / `NEXT_PUBLIC_SITE_URL`.

## Structured data

- [ ] JSON-LD is valid JSON and wrapped in `<script type="application/ld+json">`.
- [ ] App track pages use `MusicRecording` schema.
- [ ] App artist pages use `MusicGroup` schema.
- [ ] Home uses `Organization` / `WebSite` schema for brand.
- [ ] `@context` is `https://schema.org` and required fields are populated.

## Internal linking

- [ ] `/pre-drop` is linked from the footer, navbar, and `/for-artists`.
- [ ] Artist pre-drop pages are linked from `/pre-drop` and any artist index.
- [ ] Internal links in `frontend/home` use `<Link>` from `react-router-dom`.
- [ ] Internal links in `frontend/app` use `<Link>` from `next/link`.
- [ ] External links use `<a target="_blank" rel="noreferrer">`.

## Sitemap / robots

- [ ] `frontend/app` has `app/sitemap.ts` and `app/robots.ts`.
- [ ] `frontend/home` has a static `public/sitemap.xml` referenced in `public/robots.txt`.
- [ ] Sitemap includes all public routes, including `/pre-drop` and artist pages.

## Prerendering (home SPA)

- [ ] Prerender plugin config lists every static route.
- [ ] Prerendered HTML for each route contains visible content, metadata, and JSON-LD.
- [ ] No routes rely solely on client-side JS for core indexable content.

## Copy accuracy

- [ ] Artist pages do not claim music is released if it is only secured/coming soon.
- [ ] “Pre-drop” language is consistent across home and app.
- [ ] Research citations link to real, accessible sources.

## When flagging

Use the format:

```
[seo-sem] rule broken — file:line — expected pattern
```

If a rule genuinely conflicts with product needs, propose updating the `seo-sem` skill instead of silently ignoring it.
