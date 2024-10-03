package main

import (
	"net/http"

	"github.com/CloudyKit/jet/v6"
)

func main() {
	views := jet.NewSet(
		jet.NewOSFileSystemLoader("./views"),
		jet.InDevelopmentMode(),
	)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		tmpl, _ := views.GetTemplate("index.jet")
		tmpl.Execute(w, nil, map[string]interface{}{
			"Title": "Hello, Jet!",
		})
	})

	http.ListenAndServe("jet.test:8080", nil)
}
