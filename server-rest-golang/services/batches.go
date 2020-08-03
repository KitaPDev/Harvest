package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
	"time"
)

func GetPopulateBatchesData() ([]models.Batch, []models.Module, []models.Plant, []models.Reservoir, []models.Nutrient, []models.Room,
	error) {

	batches, err := repositories.GetAllBatches()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	modules, err := repositories.GetAllModules()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	plants, err := repositories.GetAllPlants()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	reservoirs, err := repositories.GetAllReservoirs()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	nutrients, err := repositories.GetAllNutrients()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	rooms, err := repositories.GetAllRooms()
	if err != nil {
		return nil, nil, nil, nil, nil, nil, err
	}

	return batches, modules, plants, reservoirs, nutrients, rooms, nil
}

func CreateBatch(batchLabel string, plantID int, reservoirIDs []int, nutrientIDs []int, moduleIDs []int, roomIDs []int, timestampBegin time.Time,
	timestampEnd time.Time, weight float64, lightsOnHour float64, lightsOffHour float64, mistingOnHour float64, mistingOffHour float64,
	remarks string) error {

	return repositories.CreateBatch(batchLabel, plantID, reservoirIDs, nutrientIDs, moduleIDs, roomIDs, timestampBegin, timestampEnd,
		weight, lightsOnHour, lightsOffHour, mistingOnHour, mistingOffHour, remarks)
}

func EditBatch(batchID int, plantID int, reservoirIDs []int, nutrientIDs []int, moduleIDs []int, roomIDs []int, timestampBegin time.Time,
	timestampEnd time.Time, weight float64, lightsOnHour float64, lightsOffHour float64, mistingOnHour float64, mistingOffHour float64,
	remarks string) error {

	return repositories.EditBatch(batchID, plantID, reservoirIDs, nutrientIDs, moduleIDs, roomIDs, timestampBegin, timestampEnd,
		weight, lightsOnHour, lightsOffHour, mistingOnHour, mistingOffHour, remarks)
}

func DeleteBatch(batchID int) error {
	return repositories.DeleteBatch(batchID)
}

func GetBatchSensorData(batchID int) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir,
	[]models.LogSensorRoom, error) {

	return repositories.GetBatchSensorData(batchID)
}
