package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func InitializeModule(moduleID int, remoteAddr string) (float64, float64, float64, float64, float64, float64, error) {
	return repositories.InitializeModule(moduleID, remoteAddr)
}

func UpdateModuleLevelSensor(logs []models.LogSensorModuleLevel) error {
	modules, err := repositories.GetAllModules()
	if err != nil {
		return err
	}

	for _, log := range logs {
		for _, module := range modules {
			if module.ModuleID == log.ModuleID && log.Level > module.Level {
				return err
			}
		}
	}

	return repositories.UpdateModuleSensor(logs)
}

func UpdateRoomSensor(roomID int, temperature float64, humidity float64) error {
	return repositories.UpdateRoomSensor(roomID, temperature, humidity)
}

func UpdateReservoirSensor(reservoirID int, tds float64, ph float64, solnTemp float64, solnLevel float64) error {
	return repositories.UpdateReservoirSensor(reservoirID, tds, ph, solnTemp, solnLevel)
}
