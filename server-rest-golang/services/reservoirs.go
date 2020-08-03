package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func GetPopulateReservoirsData() ([]models.Reservoir, []models.Nutrient, error) {
	reservoirs, err := repositories.GetAllReservoirs()
	if err != nil {
		return nil, nil, err
	}

	nutrients, err := repositories.GetAllNutrients()
	if err != nil {
		return nil, nil, err
	}

	return reservoirs, nutrients, nil
}

func CreateReservoir(reservoirLabel string, nutrientIDs []int) error {
	return repositories.CreateReservoir(reservoirLabel, nutrientIDs)
}

func EditReservoir(reservoirID int, reservoirLabel string, nutrientIDs []int) error {
	return repositories.EditReservoir(reservoirID, reservoirLabel, nutrientIDs)
}

func DeleteReservoir(reservoirID int) error {
	return repositories.DeleteReservoir(reservoirID)
}
