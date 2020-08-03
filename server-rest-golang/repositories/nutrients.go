package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
)

func GetAllNutrients() ([]models.Nutrient, error) {
	db := database.GetDB()

	sqlStatement := `SELECT nutrient_id, nutrient_label, part, nutrient_type, cc_per_liter, n, p, k FROM nutrient ORDER BY nutrient_id;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	nutrients := make([]models.Nutrient, 0)

	defer rows.Close()
	for rows.Next() {
		nutrient := models.Nutrient{}

		err = rows.Scan(
			&nutrient.NutrientID,
			&nutrient.NutrientLabel,
			&nutrient.Part,
			&nutrient.NutrientType,
			&nutrient.CCPerLiter,
			&nutrient.N,
			&nutrient.P,
			&nutrient.K,
		)
		if err != nil {
			return nil, err
		}

		nutrients = append(nutrients, nutrient)
	}

	return nutrients, nil
}

func CreateNutrient(nutrientLabel string, part int, nutrientType int, ccPerLiter float64, n float64, p float64,
	k float64) error {

	db := database.GetDB()

	sqlStatement := `INSERT INTO nutrient (nutrient_label, part, nutrient_type, cc_per_liter, n, p, k) 
			VALUES ($1, $2, $3, $4, $5, $6, $7);`

	_, err := db.Query(sqlStatement, nutrientLabel, part, nutrientType, ccPerLiter, n, p, k)
	if err != nil {
		return err
	}

	return nil
}

func EditNutrient(nutrientID int, nutrientLabel string, part int, nutrientType int, ccPerLiter float64, n float64, p float64,
	k float64) error {

	db := database.GetDB()

	sqlStatement := `UPDATE nutrient 
			SET nutrient_label = $2,
			    part = $3,
			    nutrient_type = $4,
			    cc_per_liter = $5,
			    n = $6,
			    p = $7,
			    k = $8
			WHERE nutrient_id = $1;`

	_, err := db.Query(sqlStatement, nutrientID, nutrientLabel, part, nutrientType, ccPerLiter, n, p, k)
	if err != nil {
		return err
	}

	return nil
}

func DeleteNutrient(nutrientID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM nutrient WHERE nutrient_id = $1;`

	_, err := db.Query(sqlStatement, nutrientID)
	if err != nil {
		return err
	}

	return nil
}
