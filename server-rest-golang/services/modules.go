package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func GetPopulateModulesData() ([]models.Module, []models.Reservoir, []models.Room, error) {
	modules, err := repositories.GetAllModules()
	if err != nil {
		return nil, nil, nil, err
	}

	reservoirs, err := repositories.GetAllReservoirs()
	if err != nil {
		return nil, nil, nil, err
	}

	rooms, err := repositories.GetAllRooms()
	if err != nil {
		return nil, nil, nil, err
	}

	return modules, reservoirs, rooms, nil
}

func CreateModule(reservoirID int, roomID int, moduleLabel string, level int) error {
	return repositories.CreateModule(reservoirID, roomID, moduleLabel, level)
}

func EditModule(moduleID int, reservoirID int, roomID int, moduleLabel string, level int) error {
	return repositories.EditModule(moduleID, reservoirID, roomID, moduleLabel, level)
}

func DeleteModule(moduleID int) error {
	return repositories.DeleteModule(moduleID)
}

func GetModuleUrls() (map[int]string, error) {
	return repositories.GetModuleUrls()
}
