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
		ApiKey            string                        `json:"api_key"`
		ModuleID          int                           `json:"module_id"`
		MapLevelSensorLog map[int]models.LogSensorLevel `json:"level"`
	}

	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	if input.ApiKey == APIKEY {
		err := services.UpdateModuleLevelSensor(input.ModuleID, input.MapLevelSensorLog)
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
		Temperature float64 `json:"temperature_room"`
		Humidity    float64 `json:"humidity_room"`
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

func UpdateGerminatorSensor(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ApiKey      string  `json:"api_key"`
		Temperature float64 `json:"temperature"`
		Humidity    float64 `json:"humidity"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	if input.ApiKey == APIKEY {
		err := services.UpdateGerminatorSensor(input.Temperature, input.Humidity)
		if err != nil {
			msg := "Error: Failed to Update Germinator Sensor"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.WriteHeader(http.StatusOK)

	} else {
		w.WriteHeader(http.StatusUnauthorized)
	}
}

// IoTTest For testing only!
func IoTTest(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ApiKey  string `json:"api_key"`
		ID      int    `json:"id"`
		Message string `json:"message"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	log.Print("IoT Test: ")
	log.Println(input)

	w.WriteHeader(http.StatusOK)
}

// IoTServerTest for testing only!
func IoTServerTest(w http.ResponseWriter, r *http.Request) {
	type Input struct {
		ModuleID int `json:"module_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	moduleUrl, err := services.GetModuleUrlByID(input.ModuleID)
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	requestBody, err := json.Marshal(input)
	if err != nil {
		msg := "Error: Failed to Marshal IoT Body"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	resp, err := http.Post(moduleUrl, "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type InputIoT struct {
		ApiKey  string `json:"api_key"`
		Message string `json:"message"`
	}

	inputIoT := InputIoT{}
	err = jsonhandler.DecodeJsonFromResponse(resp, &inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	err = r.Body.Close()
	if err != nil {
		msg := "Error: Failed to Close Body of Response from IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonData, err := json.Marshal(inputIoT)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}
