package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulateRooms(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	rooms, _, err := services.GetPopulateRoomsData()
	if err != nil {
		msg := "Error: Failed to Get Populate Rooms Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	type Output struct {
		Rooms []models.Room `json:"rooms"`
	}
	output := Output{
		Rooms: rooms,
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

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		RoomLabel string `json:"room_label"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.CreateRoom(input.RoomLabel)
	if err != nil {
		msg := "Error: Failed to Create Room"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func EditRoom(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	input := models.Room{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.EditRoom(input.RoomID, input.RoomLabel)
	if err != nil {
		msg := "Error: Failed to Edit Room"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteRoom(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		RoomID int `json:"room_id"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromRequest(w, r, &input)

	err := services.DeleteRoom(input.RoomID)
	if err != nil {
		msg := "Error: Failed to Delete Room"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
