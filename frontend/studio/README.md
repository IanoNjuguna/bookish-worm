# Doba Studio

Standalone Next.js application for artists, served at `studio.doba.world`.

## Responsibilities

- Upload tracks and albums
- Manage drafts
- View analytics
- Track earnings and payouts

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **UI:** Custom Shadcn UI components
- **Web3:** Lucid Evolution for CIP-30 wallet interactions
- **i18n:** next-intl

## Local Development

```bash
cd frontend/studio
bun install
bun dev
```

The app runs at `http://localhost:3001` by default. To test with the `studio.doba.world` domain, add it to `/etc/hosts`:

```text
127.0.0.1 studio.doba.world
```

Then visit `http://studio.doba.world:3001`.

## API

All API calls are sent to `/api-backend/*`, which is rewritten to the Core API service via `NEXT_PUBLIC_API_URL`.
