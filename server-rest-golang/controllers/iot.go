package controllers

import (
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

var API_KEY string = "MODKJ2021"

func UpdateModuleSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ApiKey                string                        `json:"api_key"`
		LogSensorModuleLevels []models.LogSensorModuleLevel `json:"log_sensor_module_level"`
	}

	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	if input.ApiKey == API_KEY {
		err := services.UpdateModuleLevelSensor(input.LogSensorModuleLevels)
		if err != nil {
			msg := "Error: Failed to Update Module Sensor"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.WriteHeader(http.StatusOK)

	} else {
		w.WriteHeader(http.StatusUnauthorized)
	}

}

func UpdateRoomSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ApiKey      string  `json:"api_key"`
		RoomID      int     `json:"room_id"`
		Temperature float64 `json:"temperature"`
		Humidity    float64 `json:"humidity"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	if input.ApiKey == API_KEY {
		err := services.UpdateRoomSensor(input.RoomID, input.Temperature, input.Humidity)
		if err != nil {
			msg := "Error: Failed to Update Room Sensor"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.WriteHeader(http.StatusOK)

	} else {
		w.WriteHeader(http.StatusUnauthorized)
	}
}

func UpdateReservoirSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ApiKey      string  `json:"api_key"`
		ReservoirID int     `json:"reservoir_id"`
		TDS         float64 `json:"tds"`
		PH          float64 `json:"ph"`
		SolnTemp    float64 `json:"soln_temp"`
		SolnLevel   float64 `json:"soln_level"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	if input.ApiKey == API_KEY {
		err := services.UpdateReservoirSensor(input.ReservoirID, input.TDS, input.PH, input.SolnTemp, input.SolnLevel)
		if err != nil {
			msg := "Error: Failed to Update Reservoir Sensor"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.WriteHeader(http.StatusOK)

	} else {
		w.WriteHeader(http.StatusUnauthorized)
	}
}
