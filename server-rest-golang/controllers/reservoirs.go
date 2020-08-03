package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulateReservoirs(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	reservoirs, nutrients, err := services.GetPopulateReservoirsData()
	if err != nil {
		msg := "Error: Failed to Get Populate Reservoirs Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		Reservoirs []models.Reservoir `json:"reservoirs"`
		Nutrients  []models.Nutrient  `json:"nutrients"`
	}
	output := Output{
		Reservoirs: reservoirs,
		Nutrients:  nutrients,
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

func CreateReservoir(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		ReservoirLabel string `json:"reservoir_label"`
		NutrientIDs    []int  `json:"nutrient_ids"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.CreateReservoir(input.ReservoirLabel, input.NutrientIDs)
	if err != nil {
		msg := "Error: Failed to Create Reservoir"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func EditReservoir(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	input := models.Reservoir{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.EditReservoir(input.ReservoirID, input.ReservoirLabel, input.NutrientIDs)
	if err != nil {
		msg := "Error: Failed to Edit Reservoir"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteReservoir(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		ReservoirID int `json:"reservoir_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.DeleteReservoir(input.ReservoirID)
	if err != nil {
		msg := "Error: Failed to Delete Reservoir"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
