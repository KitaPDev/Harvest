package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulateModules(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	modules, reservoirs, rooms, err := services.GetPopulateModulesData()
	if err != nil {
		msg := "Error: Failed to Get Populate Modules Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		Modules    []models.Module    `json:"modules"`
		Reservoirs []models.Reservoir `json:"reservoirs"`
		Rooms      []models.Room      `json:"rooms"`
	}
	output := Output{
		Modules:    modules,
		Reservoirs: reservoirs,
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

func CreateModule(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		ReservoirID int    `json:"reservoir_id"`
		RoomID      int    `json:"room_id"`
		ModuleLabel string `json:"module_label"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.CreateModule(input.ReservoirID, input.RoomID, input.ModuleLabel)
	if err != nil {
		msg := "Error: Failed to Create Module"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func EditModule(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	input := models.Module{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.EditModule(input.ModuleID, input.ReservoirID, input.RoomID, input.ModuleLabel)
	if err != nil {
		msg := "Error: Failed to Create Module"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteModule(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		ModuleID int `json:"module_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.DeleteModule(input.ModuleID)
	if err != nil {
		msg := "Error: Failed to Delete Module"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
