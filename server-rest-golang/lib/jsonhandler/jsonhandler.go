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

func DecodeJsonFromResponse(w http.ResponseWriter, r *http.Response, target interface{}) error {
	body := r.Body

	err := r.Body.Close()
	if err != nil {
		msg := "Error: Failed to Close Body of Response from IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return err
	}

	return json.NewDecoder(body).Decode(target)
}