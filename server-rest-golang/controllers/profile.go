package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulateProfile(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		UserID int `json:"user_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	user, err := services.GetPopulateProfileData(input.UserID)
	if err != nil {
		msg := "Error: Failed to Get Populate Profile Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonData, err := json.Marshal(user)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
