package main

import (
	"log"
	"net/http"
	"strings"

	"doba-monolith/internal/domains/about"
	"doba-monolith/internal/domains/marketplace"
	"doba-monolith/internal/domains/studio"
)

func main() {
	// init handlers
	aboutApp := about.RegisterRoutes()
	marketplaceApp := marketplace.RegisterRoutes()
	studioApp := studio.RegisterRoutes()

	// build subdomain multiplexer middleware
	subdomainRouter := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		host := r.Host

		// strip port strings, e.g: studio.doba.local:8080 -> studio.doba.local
		if strings.Contains(host, ":") {
			host = strings.Split(host, ":")[0]
		}

		// split hostname by dots, e.g: studio.doba.local -> [studio, doba, local]
		parts := strings.Split(host, ".")

		// check if a subdomain prefix exists, e.g: len of "studio.doba.local" is 3
		if len(parts) > 2 {
			subdomain := strings.ToLower(parts[0])

			switch subdomain {
			case "studio":
				studioApp.ServeHTTP(w, r)
				return
			case "about":
				aboutApp.ServeHTTP(w, r)
				return
			}
		}

		// fallback default: serve the core marketplace
		marketplaceApp.ServeHTTP(w, r)
	})

	log.Println("🚀 Listening on http://doba.local:8080")
	if err := http.ListenAndServe(":8080", subdomainRouter); err != nil {
		log.Fatal("server crashed error: %v", err)
	}
}