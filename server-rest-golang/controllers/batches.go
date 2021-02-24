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

func PopulateBatches(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	batches, modules, plants, reservoirs, nutrients, rooms, err := services.GetPopulateBatchesData()
	if err != nil {
		msg := "Error: Failed to Get Populate Batches Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		Batches    []models.Batch     `json:"batches"`
		Modules    []models.Module    `json:"modules"`
		Plants     []models.Plant     `json:"plants"`
		Reservoirs []models.Reservoir `json:"reservoirs"`
		Nutrients  []models.Nutrient  `json:"nutrients"`
		Rooms      []models.Room      `json:"rooms"`
	}
	output := Output{
		Batches:    batches,
		Modules:    modules,
		Plants:     plants,
		Reservoirs: reservoirs,
		Nutrients:  nutrients,
		Rooms:      rooms,
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

func CreateBatch(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		BatchLabel       string    `json:"batch_label"`
		PlantID          int       `json:"plant_id"`
		ReservoirIDs     []int     `json:"reservoir_ids"`
		NutrientIDs      []int     `json:"nutrient_ids"`
		ModuleIDs        []int     `json:"module_ids"`
		RoomIDs          []int     `json:"room_ids"`
		TimeStampBegin   time.Time `json:"time_stamp_begin"`
		TimeStampEnd     time.Time `json:"time_stamp_end"`
		Weight           float64   `json:"weight"`
		LightsOnHour     float64   `json:"lights_on_hour"`
		LightsOffHour    float64   `json:"lights_off_hour"`
		MistingOnSecond  float64   `json:"misting_on_second"`
		MistingOffSecond float64   `json:"misting_off_second"`
		Remarks          string    `json:"remarks"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.CreateBatch(input.BatchLabel, input.PlantID, input.ReservoirIDs, input.NutrientIDs, input.ModuleIDs, input.RoomIDs,
		input.TimeStampBegin, input.TimeStampEnd, input.Weight, input.LightsOnHour, input.LightsOffHour, input.MistingOnSecond,
		input.MistingOffSecond, input.Remarks)
	if err != nil {
		msg := "Error: Failed to Create Batch"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func EditBatch(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	input := models.Batch{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.EditBatch(input.BatchID, input.PlantID, input.ReservoirIDs, input.NutrientIDs, input.ModuleIDs, input.RoomIDs,
		input.TimeStampBegin, input.TimeStampEnd, input.Weight, input.LightsOnHour, input.LightsOffHour, input.MistingOnSecond,
		input.MistingOffSecond, input.Remarks)
	if err != nil {
		msg := "Error: Failed to Edit Batch"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteBatch(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		BatchID int `json:"batch_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.DeleteBatch(input.BatchID)
	if err != nil {
		msg := "Error: Failed to Delete Batch"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func BatchDetails(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		BatchID int `json:"batch_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	logSensorModuleLevels, logSensorReservoirs, logSensorRooms, err := services.GetBatchSensorData(input.BatchID)
	if err != nil {
		msg := "Error: Failed to Get Batch Sensor Data"
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
