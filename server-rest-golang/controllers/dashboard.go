package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
	"time"
)

func PopulateDashboard(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	moduleLevelLogs, reservoirLogs, roomLogs, modules, reservoirs, rooms, err := services.GetPopulateDashboardData()
	if err != nil {
		msg := "Error: Failed to Get Populate Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		ModuleLevelLogs []models.LogSensorModuleLevel `json:"module_level_logs"`
		ReservoirLogs   []models.LogSensorReservoir   `json:"reservoir_logs"`
		RoomLogs        []models.LogSensorRoom        `json:"room_logs"`
		Modules         []models.Module               `json:"modules"`
		Reservoirs      []models.Reservoir            `json:"reservoirs"`
		Rooms           []models.Room                 `json:"rooms"`
	}
	output := Output{
		ModuleLevelLogs: moduleLevelLogs,
		ReservoirLogs:   reservoirLogs,
		RoomLogs:        roomLogs,
		Modules:         modules,
		Reservoirs:      reservoirs,
		Rooms:           rooms,
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

func UpdateSensorLogs(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	moduleLevelLogs, reservoirLogs, roomLogs, err := services.GetLatestSensorLogData()
	if err != nil {
		msg := "Error: Failed to Get Populate Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		ModuleLevelLogs []models.LogSensorModuleLevel `json:"module_level_logs"`
		ReservoirLogs   []models.LogSensorReservoir   `json:"reservoir_logs"`
		RoomLogs        []models.LogSensorRoom        `json:"room_logs"`
	}
	output := Output{
		ModuleLevelLogs: moduleLevelLogs,
		ReservoirLogs:   reservoirLogs,
		RoomLogs:        roomLogs,
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

func History(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
		TimeStampEnd   time.Time `json:"time_stamp_end"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	logSensorModuleLevels, logSensorReservoirs, logSensorRooms, err := services.GetHistorySensorLogData(input.TimeStampBegin,
		input.TimeStampEnd)
	if err != nil {
		msg := "Error: Failed to Get History Sensor Log Data"
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
