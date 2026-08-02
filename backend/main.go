package main

import (
	// "doba-monolith/backend/server"
	// "embed"
	// "io/fs"
	"log"
	"net/http"
)

// //go:embed frontend/marketplace/.next
// var embeddedFiles embed.FS

func main() {
	log.Println("Application starting...")
	// distFS, err := fs.Sub(embeddedFiles, "frontend/marketplace/.next")
	// if err != nil {
	// 	log.Fatal("failed to get embedded dist fs: ", err)
	// }

	// marketplaceFS := http.FileServer(http.FS(distFS))

	// srv := server.New(marketplaceFS)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for /")
		w.Write([]byte("OK"))
	})

	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("could not start server: %s\n", err)
	}
}
