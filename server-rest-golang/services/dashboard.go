package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
	"time"
)

func GetPopulateGrowerDashboardData() ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom,
	[]models.Module, []models.Reservoir, []models.Room, error) {

	moduleLevelLogs, reservoirLogs, roomLogs, err := repositories.GetLatestGrowerSensorLogs()
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

func GetLatestGrowerSensorLogs() ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom, error) {
	return repositories.GetLatestGrowerSensorLogs()
}

func GetLatestGerminatorSensorLogs() ([]models.LogSensorGerminator, error) {
	return repositories.GetLatestGerminatorSensorLogs()
}

func GetGrowerHistorySensorLogData(timestampBegin time.Time, timestampEnd time.Time) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir,
	[]models.LogSensorRoom, error) {

	moduleLevelLogs, reservoirLogs, roomLogs, err := repositories.GetHistoryGrowerSensorLogs(timestampBegin, timestampEnd)
	if err != nil {
		return nil, nil, nil, err
	}

	return moduleLevelLogs, reservoirLogs, roomLogs, err
}


func GetGerminatorHistorySensorLogData(timestampBegin time.Time, timestampEnd time.Time) ([]models.LogSensorGerminator, error) {

	germinatorLogs, err := repositories.GetHistoryGerminatorSensorLogs(timestampBegin, timestampEnd)
	if err != nil {
		return nil, err
	}

	return germinatorLogs, err
}
