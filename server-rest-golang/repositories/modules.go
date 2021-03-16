package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
)

func GetAllModules() ([]models.Module, error) {
	db := database.GetDB()

	sqlStatement := `SELECT module_id, reservoir_id, room_id, module_label, level FROM module ORDER BY module_id;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	modules := make([]models.Module, 0)

	defer rows.Close()
	for rows.Next() {
		module := models.Module{}

		err = rows.Scan(
			&module.ModuleID,
			&module.ReservoirID,
			&module.RoomID,
			&module.ModuleLabel,
			&module.Level,
		)
		if err != nil {
			return nil, err
		}

		modules = append(modules, module)
	}

	return modules, nil
}

func CreateModule(reservoirID int, roomID int, moduleLabel string, level int) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO module (reservoir_id, room_id, module_label, level) 
			VALUES ($1, $2, $3, $4);`

	_, err := db.Query(sqlStatement, reservoirID, roomID, moduleLabel, level)
	if err != nil {
		return err
	}

	return nil
}

func EditModule(moduleID int, reservoirID int, roomID int, moduleLabel string, level int) error {
	db := database.GetDB()

	sqlStatement := `UPDATE module 
			SET module_label = $2,
			    reservoir_id = $3,
			    room_id = $4,
				level = $5
			WHERE module_id = $1;`

	_, err := db.Query(sqlStatement, moduleID, moduleLabel, reservoirID, roomID, level)
	if err != nil {
		return err
	}

	return nil
}

func DeleteModule(moduleID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM module WHERE module_id = $1;`

	_, err := db.Query(sqlStatement, moduleID)
	if err != nil {
		return err
	}

	return nil
}

func GetModuleUrlByID(moduleID int) (string, error) {
	db := database.GetDB()

	sqlStatement := `SELECT * FROM module_url WHERE "moduleID" = $1;`

	rows, err := db.Query(sqlStatement, moduleID)
	if err != nil {
		return "", err
	}

	moduleUrl := ""

	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(
			&moduleUrl,
		)
		if err != nil {
			return "", err
		}
	}

	return moduleUrl, err
}