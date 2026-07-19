# Doba Music Metadata API

NFT metadata API for Doba Music platform.

## Quick Start

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Test the API
curl http://localhost:3000/health
```

## Add Sample Data

```bash
curl -X POST http://localhost:3000/admin/tracks \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-secret-key" \
  -d '{
    "token_id": 1,
    "name": "Sunrise Melody",
    "description": "A smooth jazz track capturing the warmth of dawn",
    "artist": "DJ Sunrise",
    "genre": "Jazz",
    "duration": "3:45",
    "release_date": "2026-02-11",
    "image_url": "https://via.placeholder.com/600x600.png?text=Sunrise+Melody",
    "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  }'
```

## View Metadata

```bash
curl http://localhost:3000/metadata/1
```

## Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `GET /metadata/:tokenId` - NFT metadata (OpenSea format)
- `GET /tracks` - List all tracks
- `POST /admin/tracks` - Add track (requires X-API-Key header)

## Deployment

See [BACKEND.md](../BACKEND.md) for deployment instructions.
