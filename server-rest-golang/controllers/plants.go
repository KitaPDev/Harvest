package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulatePlants(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	plants, err := services.GetPopulatePlantsData()
	if err != nil {
		msg := "Error: Failed to Get Populate Plants Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonData, err := json.Marshal(plants)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func CreatePlant(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		PlantLabel       string  `json:"plant_label"`
		TDSHigh          float64 `json:"tds_high"`
		TDSLow           float64 `json:"tds_low"`
		PHHigh           float64 `json:"ph_high"`
		PHLow            float64 `json:"ph_low"`
		TemperatureHigh  float64 `json:"temperature_high"`
		TemperatureLow   float64 `json:"temperature_low"`
		LightsOffHour    float64 `json:"lights_off_hour"`
		LightsOnHour     float64 `json:"lights_on_hour"`
		MistingOffSecond float64 `json:"misting_off_second"`
		MistingOnSecond  float64 `json:"misting_on_second"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.CreatePlant(input.PlantLabel, input.TDSHigh, input.TDSLow, input.PHHigh, input.PHLow, input.TemperatureHigh,
		input.TemperatureLow, input.LightsOffHour, input.LightsOnHour, input.MistingOffSecond, input.MistingOnSecond)
	if err != nil {
		msg := "Error: Failed to Create Plant"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func EditPlant(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	input := models.Plant{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.EditPlant(input.PlantID, input.PlantLabel, input.TDSHigh, input.TDSLow, input.PHHigh, input.PHLow, input.TemperatureHigh,
		input.TemperatureLow, input.LightsOffHour, input.LightsOnHour, input.MistingOffSecond, input.MistingOnSecond)
	if err != nil {
		msg := "Error: Failed to Edit Plant"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeletePlant(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		PlantID int `json:"plant_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.DeletePlant(input.PlantID)
	if err != nil {
		msg := "Error: Failed to Delete Plant"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
