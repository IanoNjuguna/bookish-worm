package server

import (
	"doba-monolith/backend/internal/domains/about"
	"doba-monolith/backend/internal/domains/marketplace"
	"doba-monolith/backend/internal/domains/studio"
	"net/http"
	"strings"
)

func New(marketplaceFS http.Handler) http.Handler {
	aboutApp := about.RegisterRoutes()
	marketplaceApp := marketplace.RegisterRoutes(marketplaceFS)
	studioApp := studio.RegisterRoutes()

	// build subdomain multiplexer middleware
	subdomainRouter := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// check for subdomain
		parts := strings.Split(r.Host, ".")
		if len(parts) > 2 {
			subdomain := parts[0]
			switch subdomain {
			case "about":
				aboutApp.ServeHTTP(w, r)
				return
			case "studio":
				studioApp.ServeHTTP(w, r)
				return
			}
		}

		// default to marketplace
		marketplaceApp.ServeHTTP(w, r)
	})

	return subdomainRouter
}
