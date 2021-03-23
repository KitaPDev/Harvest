package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
	"time"
)

func GetPopulateGrowerDashboardData() ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom,
	[]models.Module, []models.Reservoir, []models.Room, error) {

	lsModuleLevelLog, lsReservoirLog, lsRoomLog, err := repositories.GetLatestGrowerSensorLogs()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	lsModule, err := repositories.GetAllModules()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	lsReservoir, err := repositories.GetAllReservoirs()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	lsRoom, err := repositories.GetAllRooms()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	return lsModuleLevelLog, lsReservoirLog, lsRoomLog, lsModule, lsReservoir, lsRoom, nil
}

func GetLatestGrowerSensorLogs() ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom, error) {
	return repositories.GetLatestGrowerSensorLogs()
}

func GetLatestGerminatorSensorLog() (*models.LogSensorGerminator, error) {
	return repositories.GetLatestGerminatorSensorLog()
}

func GetGrowerHistorySensorLogData(timestampBegin time.Time, timestampEnd time.Time) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir,
	[]models.LogSensorRoom, error) {

	lsModuleLevelLog, lsReservoirLogs, lsRoomLogs, err := repositories.GetHistoryGrowerSensorLogs(timestampBegin, timestampEnd)
	if err != nil {
		return nil, nil, nil, err
	}

	return lsModuleLevelLog, lsReservoirLogs, lsRoomLogs, err
}

func GetGerminatorHistorySensorLogData(timestampBegin time.Time, timestampEnd time.Time) ([]models.LogSensorGerminator, error) {

	lsGerminatorLog, err := repositories.GetHistoryGerminatorSensorLogs(timestampBegin, timestampEnd)
	if err != nil {
		return nil, err
	}

	return lsGerminatorLog, err
}
