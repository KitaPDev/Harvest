package jsonhandler

import (
	"encoding/json"
	"github.com/golang/gddo/httputil/header"
	"log"
	"net/http"
)

func DecodeJsonFromRequest(w http.ResponseWriter, r *http.Request, v interface{}) {
	if r.Header.Get("Content-Type") != "" {
		value, _ := header.ParseValueAndParams(r.Header, "Content-Type")
		if value != "application/json" {
			msg := "Content-Type header is not application/json"
			http.Error(w, msg, http.StatusUnsupportedMediaType)
		}
	}
	err := json.NewDecoder(r.Body).Decode(v)
	if err != nil {
		msg := "Error: Failed to Decode JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
	}
}

func DecodeJsonFromResponse(r *http.Response, target interface{}) error {
	return json.NewDecoder(r.Body).Decode(target)
}
