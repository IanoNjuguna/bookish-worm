package marketplace

import (
	"net/http"
)

func RegisterRoutes(fileServer http.Handler) http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/", fileServer)
	return mux
}
