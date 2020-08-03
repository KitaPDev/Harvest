package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func InitializeModule(moduleID int, remoteAddr string) (float64, float64, float64, float64, float64, float64, error) {
	return repositories.InitializeModule(moduleID, remoteAddr)
}

func UpdateModuleLevelSensor(logs []models.LogSensorModuleLevel) error {
	return repositories.UpdateModuleLevelSensor(logs)
}

func UpdateModuleSensor(moduleID int, pressure float64) error {
	return repositories.UpdateModuleSensor(moduleID, pressure)
}

func UpdateRoomSensor(roomID int, temperature float64, humidity float64) error {
	return repositories.UpdateRoomSensor(roomID, temperature, humidity)
}

func UpdateReservoirSensor(reservoirID int, tds float64, ph float64, solnTemp float64, solnLevel float64) error {
	return repositories.UpdateReservoirSensor(reservoirID, tds, ph, solnTemp, solnLevel)
}
