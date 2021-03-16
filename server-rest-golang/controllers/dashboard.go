package controllers

import (
	"bytes"
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
	"time"
)

const germinatorUrl = ""

func PopulateGrowerDashboardCurrent(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	moduleLevelLogs, reservoirLogs, roomLogs, modules, reservoirs, rooms, err := services.GetPopulateGrowerDashboardData()
	if err != nil {
		msg := "Error: Failed to Get Populate Grower Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorModuleLevels []models.LogSensorModuleLevel `json:"log_sensor_module_levels"`
		LogSensorReservoirs   []models.LogSensorReservoir   `json:"log_sensor_reservoirs"`
		LogRooms              []models.LogSensorRoom        `json:"log_sensor_rooms"`
		Modules               []models.Module               `json:"modules"`
		Reservoirs            []models.Reservoir            `json:"reservoirs"`
		Rooms                 []models.Room                 `json:"rooms"`
	}
	output := Output{
		LogSensorModuleLevels: moduleLevelLogs,
		LogSensorReservoirs:   reservoirLogs,
		LogRooms:              roomLogs,
		Modules:               modules,
		Reservoirs:            reservoirs,
		Rooms:                 rooms,
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

func GetLatestGrowerSensorLogs(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	moduleLevelLogs, reservoirLogs, roomLogs, err := services.GetLatestGrowerSensorLogs()
	if err != nil {
		msg := "Error: Failed to Get Latest Grower Sensor Logs"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorModuleLevels []models.LogSensorModuleLevel `json:"log_sensor_module_levels"`
		LogSensorReservoirs   []models.LogSensorReservoir   `json:"log_sensor_reservoirs"`
		LogRooms              []models.LogSensorRoom        `json:"log_sensor_rooms"`
	}
	output := Output{
		LogSensorModuleLevels: moduleLevelLogs,
		LogSensorReservoirs:   reservoirLogs,
		LogRooms:              roomLogs,
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

func UpdateModuleSettings(w http.ResponseWriter, r *http.Request) {
	input := models.ModuleSettings{}

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

	inputIoT := models.ModuleSettings{}
	err = jsonhandler.DecodeJsonFromResponse(w, resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
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

func GetModuleSettings(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	mapModuleIDModuleSettings := make(map[int]models.ModuleSettings, 0)

	mapModuleIDModuleUrl, err := services.GetAllModuleUrls()
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Flag struct {
		ModuleID int `json:"module_id"`
	}
	flg := Flag{ModuleID: 0}

	requestBody, err := json.Marshal(flg)
	if err != nil {
		msg := "Error: Failed to Marshal Flag"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	for moduleID, moduleUrl := range mapModuleIDModuleUrl {
		resp, err := http.Post(moduleUrl, "application/json", bytes.NewReader(requestBody))
		if err != nil {
			msg := "Error: Failed to Send HTTP Post request to IoT device"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		inputIoT := models.ModuleSettings{}
		err = jsonhandler.DecodeJsonFromResponse(w, resp, inputIoT)
		if err != nil {
			msg := "Error: Failed to Decode Json from Response"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		mapModuleIDModuleSettings[moduleID] = inputIoT
	}

	jsonData, err := json.Marshal(mapModuleIDModuleSettings)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func UpdateReservoirSettings(w http.ResponseWriter, r *http.Request) {
	input := models.ReservoirSettings{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	reservoirUrl, err := services.GetReservoirUrlByID(input.ReservoirID)
	if err != nil {
		msg := "Error: Failed to Get Reservoir Urls"
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

	resp, err := http.Post(reservoirUrl, "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	inputIoT := models.ReservoirSettings{}
	err = jsonhandler.DecodeJsonFromResponse(w, resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
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

func GetReservoirSettings(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	mapReservoirIDReservoirSettings := make(map[int]models.ReservoirSettings, 0)

	mapReservoirIDReservoirUrl, err := services.GetAllReservoirUrls()
	if err != nil {
		msg := "Error: Failed to Get Module Urls"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Flag struct {
		ReservoirID int `json:"reservoir_id"`
	}
	flg := Flag{ReservoirID: 1}

	requestBody, err := json.Marshal(flg)
	if err != nil {
		msg := "Error: Failed to Marshal Flag"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	for reservoirID, reservoirUrl := range mapReservoirIDReservoirUrl {
		resp, err := http.Post(reservoirUrl, "application/json", bytes.NewReader(requestBody))
		if err != nil {
			msg := "Error: Failed to Send HTTP Post request to IoT device"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		inputIoT := models.ReservoirSettings{}
		err = jsonhandler.DecodeJsonFromResponse(w, resp, inputIoT)
		if err != nil {
			msg := "Error: Failed to Decode Json from Response"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return
		}

		mapReservoirIDReservoirSettings[reservoirID] = inputIoT
	}

	jsonData, err := json.Marshal(mapReservoirIDReservoirSettings)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func PopulateGrowerDashboardHistory(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
		TimeStampEnd   time.Time `json:"time_stamp_end"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	logSensorModuleLevels, logSensorReservoirs, logSensorRooms, err := services.GetGrowerHistorySensorLogData(input.TimeStampBegin,
		input.TimeStampEnd)
	if err != nil {
		msg := "Error: Failed to Get Populate Grower Dashboard History Sensor Log Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorModuleLevels []models.LogSensorModuleLevel `json:"log_sensor_module_levels"`
		LogSensorReservoirs   []models.LogSensorReservoir   `json:"log_sensor_reservoirs"`
		LogSensorRooms        []models.LogSensorRoom        `json:"log_sensor_rooms"`
	}
	output := Output{
		LogSensorModuleLevels: logSensorModuleLevels,
		LogSensorReservoirs:   logSensorReservoirs,
		LogSensorRooms:        logSensorRooms,
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

func PopulateGerminatorDashboardCurrent(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	logSensorGerminator, err := services.GetLatestGerminatorSensorLogs()
	if err != nil {
		msg := "Error: Failed to Get Populate Germinator Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorGerminators []models.LogSensorGerminator `json:"log_sensor_germinators"`
	}
	output := Output{
		LogSensorGerminators: logSensorGerminator,
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

func PopulateGerminatorDashboardHistory(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
		TimeStampEnd   time.Time `json:"time_stamp_end"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	logSensorGerminator, err := services.GetGerminatorHistorySensorLogData(input.TimeStampBegin,
		input.TimeStampEnd)
	if err != nil {
		msg := "Error: Failed to Get Populate Germinator Dashboard History Sensor Log Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorGerminators []models.LogSensorGerminator `json:"log_sensor_germinators"`
	}
	output := Output{
		LogSensorGerminators: logSensorGerminator,
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

func UpdateGerminatorSettings(w http.ResponseWriter, r *http.Request) {
	input := models.ReservoirSettings{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	requestBody, err := json.Marshal(input)
	if err != nil {
		msg := "Error: Failed to Marshal IoT Body"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	resp, err := http.Post(germinatorUrl, "application/json", bytes.NewReader(requestBody))
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	inputIoT := models.GerminatorSettings{}
	err = jsonhandler.DecodeJsonFromResponse(w, resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
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

func GetGerminatorSettings(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	resp, err := http.Get(germinatorUrl)
	if err != nil {
		msg := "Error: Failed to Send HTTP Post request to IoT device"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	inputIoT := models.GerminatorSettings{}
	err = jsonhandler.DecodeJsonFromResponse(w, resp, inputIoT)
	if err != nil {
		msg := "Error: Failed to Decode Json from Response"
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
