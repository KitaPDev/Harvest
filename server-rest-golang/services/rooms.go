package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func GetPopulateRoomsData() ([]models.Room, []models.Module, error) {
	rooms, err := repositories.GetAllRooms()
	if err != nil {
		return nil, nil, err
	}

	modules, err := repositories.GetAllModules()
	if err != nil {
		return nil, nil, err
	}

	return rooms, modules, nil
}

func CreateRoom(roomLabel string) error {
	return repositories.CreateRoom(roomLabel)
}

func EditRoom(roomID int, roomLabel string) error {
	return repositories.EditRoom(roomID, roomLabel)
}

func DeleteRoom(roomID int) error {
	return repositories.DeleteRoom(roomID)
}
