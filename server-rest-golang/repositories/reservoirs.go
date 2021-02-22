package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
	"strconv"
)

func GetAllReservoirs() ([]models.Reservoir, error) {
	db := database.GetDB()

	sqlStatement := `SELECT reservoir_id, nutrient_id FROM reservoirs_nutrients ORDER BY reservoir_id;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	mapReservoirIDsNutrientIDs := make(map[int][]int, 0)

	defer rows.Close()
	for rows.Next() {
		var reservoirID, nutrientID int

		err = rows.Scan(
			&reservoirID,
			&nutrientID,
		)
		if err != nil {
			return nil, err
		}

		mapReservoirIDsNutrientIDs[reservoirID] = append(mapReservoirIDsNutrientIDs[reservoirID], nutrientID)
	}

	sqlStatement = `SELECT reservoir_id, reservoir_label FROM reservoir`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	reservoirs := make([]models.Reservoir, 0)

	defer rows.Close()
	for rows.Next() {
		reservoir := models.Reservoir{}

		err := rows.Scan(
			&reservoir.ReservoirID,
			&reservoir.ReservoirLabel,
		)
		if err != nil {
			return nil, err
		}

		reservoir.NutrientIDs = mapReservoirIDsNutrientIDs[reservoir.ReservoirID]

		reservoirs = append(reservoirs, reservoir)
	}

	return reservoirs, nil
}

func CreateReservoir(reservoirLabel string, nutrientIDs []int) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO reservoir (reservoir_label) VALUES ($1);`

	_, err := db.Query(sqlStatement, reservoirLabel)
	if err != nil {
		return err
	}

	sqlStatement = `SELECT reservoir_id FROM reservoir WHERE reservoir_label = $1;`

	rows, err := db.Query(sqlStatement, reservoirLabel)
	if err != nil {
		return err
	}

	var reservoirID int

	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(
			&reservoirID,
		)
		if err != nil {
			return err
		}
	}

	sqlStatement = `INSERT INTO reservoirs_nutrients (reservoir_id, nutrient_id)  VALUES `

	for i, nutrientID := range nutrientIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(reservoirID) + `,` + strconv.Itoa(nutrientID) + `)`

		if i < len(nutrientIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	return nil
}

func EditReservoir(reservoirID int, reservoirLabel string, nutrientIDs []int) error {
	db := database.GetDB()

	sqlStatement := `UPDATE reservoir SET reservoir_label = $1 WHERE reservoir_id = $2;`

	_, err := db.Query(sqlStatement, reservoirLabel, reservoirID)
	if err != nil {
		return err
	}

	sqlStatement = `DELETE FROM reservoirs_nutrients WHERE reservoir_id = $1;`

	_, err = db.Query(sqlStatement, reservoirID)
	if err != nil {
		return err
	}

	if len(nutrientIDs) > 0 {
		sqlStatement = `INSERT INTO reservoirs_nutrients (reservoir_id, nutrient_id) VALUES `

		for i, nutrientID := range nutrientIDs {
			sqlStatement = sqlStatement + `(` + strconv.Itoa(reservoirID) + `,` + strconv.Itoa(nutrientID) + `)`

			if i < len(nutrientIDs)-1 {
				sqlStatement = sqlStatement + `, `
			}
		}

		sqlStatement = sqlStatement + `;`

		_, err = db.Query(sqlStatement)
		if err != nil {
			return err
		}
	}

	return nil
}

func DeleteReservoir(reservoirID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM reservoir WHERE reservoir_id = $1`

	_, err := db.Query(sqlStatement, reservoirID)
	if err != nil {
		return err
	}

	return nil
}
