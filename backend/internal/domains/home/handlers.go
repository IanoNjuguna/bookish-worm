package about

import (
	"embed"
	"io/fs"
	"net/http"
)

// embed the contents of the 'dist' folder tree
//go:embed dist
var embeddedFiles embed.FS

func RegisterRoutes() http.Handler {
	// extract the inner contents of the 'dist' directory
	distFS, err := fs.Sub(embeddedFiles, "dist")
	if err != nil {
		// use the raw embed system if slicing fails
		distFS = embeddedFiles
	}
	mux := http.NewServeMux()

	// create a native file server wrapped around the asset pool
	fileServer := http.FileServer(http.FS(distFS))

	// serve static assets or fall back to index.html
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// strip leading slash to check filesystem names
		if len(path) > 0 && path[0] == '/' {
			path = path[1:]
		}

		// check if the requested file actually exists in our compiled asset bundle
		_, err := distFS.Open(path)
		if err == nil && path != "" {
			// serve the static asset file directly
			fileServer.ServeHTTP(w, r)
			return
		}

		// if it's the root path, serve index.html
		r.URL.Path = "/"
		fileServer.ServeHTTP(w,r)
	})
	return mux
}
