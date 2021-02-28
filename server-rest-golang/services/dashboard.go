package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
	"time"
)

func GetPopulateGrowerDashboardData(timestampBegin time.Time) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom,
	[]models.Module, []models.Reservoir, []models.Room, error) {

	moduleLevelLogs, reservoirLogs, roomLogs, err := repositories.GetLatestGrowerSensorLogs(timestampBegin)
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	modules, err := repositories.GetAllModules()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	reservoirs, err := repositories.GetAllReservoirs()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	rooms, err := repositories.GetAllRooms()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	return moduleLevelLogs, reservoirLogs, roomLogs, modules, reservoirs, rooms, nil
}

func GetLatestGrowerSensorLogData(timestampBegin time.Time) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom, error) {
	return repositories.GetLatestGrowerSensorLogs(timestampBegin)
}

func GetLatestGerminatorSensorLogData(timestampBegin time.Time) ([]models.LogSensorGerminator, error) {
	return repositories.GetLatestGerminatorSensorLogs(timestampBegin)
}

func GetHistorySensorLogData(timestampBegin time.Time, timestampEnd time.Time) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir,
	[]models.LogSensorRoom, error) {

	return repositories.GetHistorySensorLogData(timestampBegin, timestampEnd)
}
