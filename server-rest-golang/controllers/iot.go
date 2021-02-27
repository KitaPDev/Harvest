package controllers

import (
	"bytes"
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

var APIKEY = "MODKJ2021"

func UpdateModuleSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ApiKey                string                        `json:"api_key"`
		LogSensorModuleLevels []models.LogSensorModuleLevel `json:"log_sensor_module_level"`
	}

	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	if input.ApiKey == APIKEY {
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

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	if input.ApiKey == APIKEY {
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
		ApiKey              string  `json:"api_key"`
		ReservoirID         int     `json:"reservoir_id"`
		TDS                 float64 `json:"tds"`
		PH                  float64 `json:"ph"`
		TemperatureSolution float64 `json:"temperature_solution"`
		SolnLevel           float64 `json:"soln_level"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	if input.ApiKey == APIKEY {
		err := services.UpdateReservoirSensor(input.ReservoirID, input.TDS, input.PH, input.TemperatureSolution, input.SolnLevel)
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

func UpdateModuleHardware(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ModuleID int `json:"module_id"`
		IsAuto   int `json:"is_auto"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	moduleUrls, err := services.GetModuleUrls()
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type BodyIoT struct {
		IsAuto int `json:"is_auto"`
	}
	bodyIoT := BodyIoT{IsAuto: input.IsAuto}
	requestBody, err := json.Marshal(bodyIoT)
	if err != nil {
		msg := "Error: Failed to Marshal IoT Body"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	resp, err := http.Post(moduleUrls[input.ModuleID-1], "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	iotInput := models.IoTInput{}
	err = jsonhandler.DecodeJsonFromResponse(w, resp, iotInput)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}
}
