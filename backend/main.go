package main

import (
	"doba-backend/server"
	"log"
	"net/http"
	"os"
)

func main() {
	log.Println("API Gateway starting...")

	cfg := server.DefaultConfig()
	log.Printf("Gateway configuration: HomeService=%s, AppService=%s\n", cfg.HomeServiceURL, cfg.AppServiceURL)

	gateway, err := server.New(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize API Gateway: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("API Gateway listening on :%s (routing doba.world -> Home, app.doba.world -> App)\n", port)
	if err := http.ListenAndServe(":"+port, gateway); err != nil {
		log.Fatalf("Gateway server error: %v", err)
	}
}
