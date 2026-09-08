// Doba PWA Service Worker
// Provides offline shell caching and background sync

const CACHE_NAME = 'doba-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/doba.png',
]

// Install: cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: network-first strategy for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Always go network-first for API, auth, and blockchain calls
  if (
    url.pathname.startsWith('/api') ||
    url.hostname.includes('blockfrost') ||
    url.hostname.includes('pinata') ||
    url.hostname.includes('turso') ||
    request.method !== 'GET'
  ) {
    return // Let browser handle natively
  }

  // Cache-first for static assets (fonts, icons, images)
  if (
    url.pathname.startsWith('/fonts/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
      )
    )
    return
  }

  // Network-first with offline fallback for navigation (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    )
  }
})
