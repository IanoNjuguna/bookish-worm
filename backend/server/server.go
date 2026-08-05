package server

import (
	"doba-backend/internal/domains/home"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

type Config struct {
	HomeServiceURL string
	AppServiceURL  string
}

func DefaultConfig() Config {
	homeURL := os.Getenv("HOME_SERVICE_URL")
	if homeURL == "" {
		homeURL = "http://localhost:3001"
	}
	appURL := os.Getenv("APP_SERVICE_URL")
	if appURL == "" {
		appURL = "http://localhost:3000"
	}
	return Config{
		HomeServiceURL: homeURL,
		AppServiceURL:  appURL,
	}
}

func createReverseProxy(targetURL string) (*httputil.ReverseProxy, error) {
	target, err := url.Parse(targetURL)
	if err != nil {
		return nil, err
	}

	proxy := httputil.NewSingleHostReverseProxy(target)
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = target.Host
		if clientIP := req.RemoteAddr; clientIP != "" {
			req.Header.Set("X-Forwarded-For", clientIP)
		}
		if req.TLS != nil {
			req.Header.Set("X-Forwarded-Proto", "https")
		} else {
			req.Header.Set("X-Forwarded-Proto", "http")
		}
	}

	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("[Gateway Proxy Error] Target %s unreachable: %v", targetURL, err)
		http.Error(w, "Bad Gateway: Upstream microservice unavailable", http.StatusBadGateway)
	}

	return proxy, nil
}

// New creates an API Gateway reverse proxy routing requests between home and app microservices.
func New(cfg Config) (http.Handler, error) {
	homeHandler := home.RegisterRoutes()

	appProxy, err := createReverseProxy(cfg.AppServiceURL)
	if err != nil {
		return nil, err
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		host := strings.ToLower(r.Host)
		if idx := strings.Index(host, ":"); idx != -1 {
			host = host[:idx]
		}

		path := r.URL.Path

		switch {
		case host == "app.doba.world" || strings.HasPrefix(host, "app."):
			log.Printf("[Gateway Router] Routing request %s -> App Service (%s)", r.URL.Path, cfg.AppServiceURL)
			appProxy.ServeHTTP(w, r)
		case strings.HasPrefix(path, "/app"):
			trimmedPath := strings.TrimPrefix(path, "/app")
			if trimmedPath == "" || !strings.HasPrefix(trimmedPath, "/") {
				trimmedPath = "/" + trimmedPath
			}
			r.URL.Path = trimmedPath
			log.Printf("[Gateway Router] Path routing /app request (%s -> %s) -> App Service (%s)", path, r.URL.Path, cfg.AppServiceURL)
			appProxy.ServeHTTP(w, r)
		case strings.HasPrefix(path, "/_next"):
			log.Printf("[Gateway Router] Routing Next.js asset %s -> App Service (%s)", r.URL.Path, cfg.AppServiceURL)
			appProxy.ServeHTTP(w, r)
		default:
			log.Printf("[Gateway Router] Serving static embedded Home page for %s", r.URL.Path)
			homeHandler.ServeHTTP(w, r)
		}
	}), nil
}
