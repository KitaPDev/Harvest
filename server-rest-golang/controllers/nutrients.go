package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulateNutrients(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	nutrients, err := services.GetPopulateNutrientsData()
	if err != nil {
		msg := "Error: Failed to Get Populate Nutrients Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonData, err := json.Marshal(nutrients)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func CreateNutrient(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		NutrientLabel string  `json:"nutrient_label"`
		Part          int     `json:"part"`
		NutrientType  int     `json:"nutrient_type"`
		CCPerLiter    float64 `json:"cc_per_liter"`
		N             float64 `json:"n"`
		P             float64 `json:"p"`
		K             float64 `json:"k"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.CreateNutrient(input.NutrientLabel, input.Part, input.NutrientType, input.CCPerLiter, input.N, input.P,
		input.K)
	if err != nil {
		msg := "Error: Failed to Create Nutrient"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func EditNutrient(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	input := models.Nutrient{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.EditNutrient(input.NutrientID, input.NutrientLabel, input.Part, input.NutrientType, input.CCPerLiter,
		input.N, input.P, input.K)
	if err != nil {
		msg := "Error: Failed to Edit Nutrient"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteNutrient(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		NutrientID int `json:"nutrient_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.DeleteNutrient(input.NutrientID)
	if err != nil {
		msg := "Error: Failed to Delete Nutrient"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
