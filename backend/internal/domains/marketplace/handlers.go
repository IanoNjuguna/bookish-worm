package marketplace

import (
	"crypto/tls"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func RegisterRoutes() http.Handler {
	/*
	 * pointer to the local address
	 * where the Next.js server runs during
	 * development
	 */
	nextjsTarget, err := url.Parse("http://127.0.0.1:3000")
	if err != nil {
		panic("Failed to parse Next.js target upstream address: " + err.Error())
	}

	// reverse proxy engine
	proxy := httputil.NewSingleHostReverseProxy(nextjsTarget)

	mux := http.NewServeMux()

	/*
	 * capture every single inbound route
	 * and pass it cleanly over to Next.js
	 */
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		/*
		 * update header information so
		 * Next.js knows the original
		 * request details
		 */
		r.Header.Set("X-Forwarded-Host", r.Host)
		r.Header.Set("X-Origin-Host", "marketplace.doba.local")

		proxy.ServeHTTP(w, r)
	})

	return mux
}