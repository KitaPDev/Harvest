package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
)

func GetPopulatePlantsData() ([]models.Plant, error) {
	return repositories.GetAllPlants()
}

func CreatePlant(plantLabel string, tdsHigh float64, tdsLow float64, phHigh float64, phLow float64, temperatureHigh float64,
	temperatureLow float64, lightsOffHour float64, lightsOnHour float64, mistingOffSecond float64, mistingOnSecond float64) error {

	return repositories.CreatePlant(plantLabel, tdsHigh, tdsLow, phHigh, phLow, temperatureHigh, temperatureLow, lightsOffHour,
		lightsOnHour, mistingOnSecond, mistingOffSecond)
}

func EditPlant(plantID int, plantLabel string, tdsHigh float64, tdsLow float64, phHigh float64, phLow float64, temperatureHigh float64,
	temperatureLow float64, lightsOffHour float64, lightsOnHour float64, mistingOffSecond float64, mistingOnSecond float64) error {

	return repositories.EditPlant(plantID, plantLabel, tdsHigh, tdsLow, phHigh, phLow, temperatureHigh, temperatureLow,
		lightsOffHour, lightsOnHour, mistingOnSecond, mistingOffSecond)
}

func DeletePlant(plantID int) error {
	return repositories.DeletePlant(plantID)
}
