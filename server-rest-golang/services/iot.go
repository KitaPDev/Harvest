package services

import (
	"github.com/Modern-Farms/server-rest-golang/lib/util"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func UpdateModuleLevelSensor(moduleID int, mapLevelSensorLog map[int]models.LogSensorLevel) error {
	modules, err := repositories.GetAllModules()
	if err != nil {
		return err
	}

	for _, module := range modules {
		if module.ModuleID == moduleID && util.MaxKey_MapInt_LogSensorLevel(mapLevelSensorLog) > module.Level {
			return err
		}
	}

	return repositories.UpdateModuleSensor(moduleID, mapLevelSensorLog)
}

func UpdateRoomSensor(roomID int, temperature float64, humidity float64) error {
	return repositories.UpdateRoomSensor(roomID, temperature, humidity)
}

func UpdateReservoirSensor(reservoirID int, tds float64, ph float64, temperatureSolution float64) error {
	return repositories.UpdateReservoirSensor(reservoirID, tds, ph, temperatureSolution)
}

func UpdateGerminatorSensor(temperature float64, humidity float64) error {
	return repositories.UpdateGerminatorSensor(temperature, humidity)
}
