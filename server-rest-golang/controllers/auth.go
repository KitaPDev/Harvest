package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/services"
	"github.com/golang/gddo/httputil/header"
	"log"
	"net/http"
)

// Cookie JWT
func Login(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("Content-Type") != "" {
		value, _ := header.ParseValueAndParams(r.Header, "Content-Type")
		if value != "application/json" {
			msg := "Content-Type header is not application/json"
			http.Error(w, msg, http.StatusUnsupportedMediaType)
			return
		}
	}

	type Input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var credentials Input

	jsonhandler.DecodeJsonFromRequest(w, r, &credentials)

	username := credentials.Username
	password := credentials.Password

	user, valid, err := services.ValidateSignIn(username, password)
	if err != nil {
		msg := "Error: Failed to Validate User"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}
	if !valid {
		msg := "Error: Invalid Credentials"
		http.Error(w, msg, http.StatusUnauthorized)
		log.Println(err)
		return
	}

	err = services.GenerateToken(username, w)
	if err != nil {
		msg := "Error: Failed to Generate Token"
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	type Output struct {
		UserID   int    `json:"user_id"`
		Username string `json:"username"`
		IsAdmin  bool   `json:"is_admin"`
	}

	output := Output{
		UserID:   user.UserID,
		Username: user.Username,
		IsAdmin:  user.IsAdmin,
	}

	jsonData, err := json.Marshal(output)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	services.InvalidateToken(w)
	w.WriteHeader(http.StatusOK)
}
