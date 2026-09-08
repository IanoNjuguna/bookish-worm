# App Architecture

`frontend/app` is the fan and wallet Next.js application served at `app.doba.world`.

It handles:
- Fan marketplace routes (home, library, search, track details)
- Wallet and profile routes (`/wallet`, `/profile`, `/assets`, `/send-money`, `/deposit`)
- Streaming and audio playback

The artist studio has been extracted into a separate Next.js app at `frontend/studio` and is served at `studio.doba.world`.

API calls are sent to `/api-backend/*`, which the Next.js app rewrites to the Core API service via `NEXT_PUBLIC_API_URL`.
