package studio

import (
	"fmt"
	"net/http"
)

func RegisterRoutes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "🟢 [Backend] serving studio.doba.world")
	})
	return mux
}
