package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
)

func GetAllPlants() ([]models.Plant, error) {
	db := database.GetDB()

	sqlStatement := `SELECT plant_id, plant_label, tds_low, tds_high, ph_low, ph_high, temperature_low, temperature_high, 
       lights_off_hour, lights_on_hour, misting_off_second, misting_on_second FROM plant;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	plants := make([]models.Plant, 0)

	defer rows.Close()
	for rows.Next() {
		plant := models.Plant{}

		err = rows.Scan(
			&plant.PlantID,
			&plant.PlantLabel,
			&plant.TDSLow,
			&plant.TDSHigh,
			&plant.PHLow,
			&plant.PHHigh,
			&plant.TemperatureLow,
			&plant.TemperatureHigh,
			&plant.LightsOffHour,
			&plant.LightsOnHour,
			&plant.MistingOffSecond,
			&plant.MistingOnSecond,
		)
		if err != nil {
			return nil, err
		}

		plants = append(plants, plant)
	}

	return plants, nil
}

func CreatePlant(plantLabel string, tdsHigh float64, tdsLow float64, phHigh float64, phLow float64, temperatureHigh float64,
	temperatureLow float64, lightsOffHour float64, lightsOnHour float64, mistingOnSecond float64, mistingOffSecond float64) error {

	db := database.GetDB()

	sqlStatement := `INSERT INTO plant (plant_label, tds_low, tds_high, ph_low, ph_high, temperature_low, temperature_high,
                   lights_off_hour, lights_on_hour, misting_off_second, misting_on_second)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

	_, err := db.Query(sqlStatement, plantLabel, tdsLow, tdsHigh, phLow, phHigh, temperatureLow, temperatureHigh, lightsOffHour,
		lightsOnHour, mistingOffSecond, mistingOnSecond)
	if err != nil {
		return err
	}

	return nil
}

func EditPlant(plantID int, plantLabel string, tdsHigh float64, tdsLow float64, phHigh float64, phLow float64, temperatureHigh float64,
	temperatureLow float64, lightsOffHour float64, lightsOnHour float64, mistingOnSecond float64, mistingOffSecond float64) error {

	db := database.GetDB()

	sqlStatement := `UPDATE plant 
			SET plant_label = $2,
			    tds_low = $3,
			    tds_high = $4,
			    ph_low = $5,
			    ph_high = $6,
			    temperature_low = $7,
			    temperature_high = $8,
			    lights_off_hour = $9,
			    lights_on_hour = $10,
			    misting_off_second = $11,
			    misting_on_second = $12
			WHERE plant_id = $1;`

	_, err := db.Query(sqlStatement, plantID, plantLabel, tdsLow, tdsHigh, phLow, phHigh, temperatureLow, temperatureHigh,
		lightsOffHour, lightsOnHour, mistingOffSecond, mistingOnSecond)
	if err != nil {
		return err
	}

	return nil
}

func DeletePlant(plantID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM plant WHERE plant_id = $1`

	_, err := db.Query(sqlStatement, plantID)
	if err != nil {
		return err
	}

	return nil
}
