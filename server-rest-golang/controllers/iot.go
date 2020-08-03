package controllers

import (
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func UpdateModuleLevelSensor(w http.ResponseWriter, r *http.Request) {
	inputs := make([]models.LogSensorModuleLevel, 0)

	jsonhandler.DecodeJsonFromBody(w, r, &inputs)

	err := services.UpdateModuleLevelSensor(inputs)
	if err != nil {
		msg := "Error: Failed to Update Module Level Sensor"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateRoomSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		RoomID      int     `json:"room_id"`
		Temperature float64 `json:"temperature"`
		Humidity    float64 `json:"humidity"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.UpdateRoomSensor(input.RoomID, input.Temperature, input.Humidity)
	if err != nil {
		msg := "Error: Failed to Update Room Sensor"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateReservoirSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ReservoirID int     `json:"reservoir_id"`
		TDS         float64 `json:"tds"`
		PH          float64 `json:"ph"`
		SolnTemp    float64 `json:"soln_temp"`
		SolnLevel   float64 `json:"soln_level"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.UpdateReservoirSensor(input.ReservoirID, input.TDS, input.PH, input.SolnTemp, input.SolnLevel)
	if err != nil {
		msg := "Error: Failed to Update Reservoir Sensor"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
