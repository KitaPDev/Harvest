package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func GetPopulateNutrientsData() ([]models.Nutrient, error) {
	return repositories.GetAllNutrients()
}

func CreateNutrient(nutrientLabel string, part int, nutrientType int, ccPerLiter float64, n float64, p float64,
	k float64) error {

	return repositories.CreateNutrient(nutrientLabel, part, nutrientType, ccPerLiter, n, p, k)
}

func EditNutrient(nutrientID int, nutrientLabel string, part int, nutrientType int, ccPerLiter float64, n float64, p float64,
	k float64) error {

	return repositories.EditNutrient(nutrientID, nutrientLabel, part, nutrientType, ccPerLiter, n, p, k)
}

func DeleteNutrient(nutrientID int) error {

	return repositories.DeleteNutrient(nutrientID)
}
