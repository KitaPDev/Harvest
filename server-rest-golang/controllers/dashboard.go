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

func PopulateGrowerDashboard(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	moduleLevelLogs, reservoirLogs, roomLogs, modules, reservoirs, rooms, err := services.GetPopulateGrowerDashboardData(input.TimeStampBegin)
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

func UpdateGrowerSensorLogs(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	moduleLevelLogs, reservoirLogs, roomLogs, err := services.GetLatestGrowerSensorLogData(input.TimeStampBegin)
	if err != nil {
		msg := "Error: Failed to Update Grower Sensor Logs"
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

func PopulateGerminatorDashboard(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		TimeStampBegin time.Time `json:"time_stamp_begin"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	logSensorGerminator, err := services.GetLatestGerminatorSensorLogData(input.TimeStampBegin)
	if err != nil {
		msg := "Error: Failed to Get Populate Germinator Dashboard Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		LogSensorGerminator []models.LogSensorGerminator `json:"log_sensor_germinator"`
	}
	output := Output{
		LogSensorGerminator: logSensorGerminator,
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
