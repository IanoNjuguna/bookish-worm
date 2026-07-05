# Reverse Proxy Matrix

Next.js gives us Server-Side Rendering (SSR) out of the box, which is vital for an asset marketplace because it allows search engines and social platforms to cleanly scrape metadata tags (like OpenGraph token previews, prices, and imagery) from our asset pages.

However, Next.js relies on a persistent running server engine (Node.js) to handle that server-side rendering, we cannot embed a Next.js production app into a Go binary using `go:embed` the same way we did with the `about` subdomain.

Here is exactly how this architecture changes and how our Go subdomains will interface with it:

1. The server will not directly compile the marketplace files into memory, but rather act as a Reverse Proxy for the `marketplace` subdomain.

2. When an inbound request hits `marketplace.doba.world`, the router will intercept it, forward the request internally to our running Next.js node application, grab the server-rendered HTML, and return it to the user.

                    ┌─────────────────────────┐
                    │    User Request         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    Go Router /          │
                    │    Reverse Proxy        │
                    └─────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     Next.js Server      │
                    │    Running Separately   │
                    └─────────────────────────┘
