package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/lib/util"
	"github.com/Modern-Farms/server-rest-golang/models"
	"strconv"
)

func UpdateModuleSensor(logs []models.LogSensorModuleLevel) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO log_sensor_module (logged_at, module_id, level, temperature_root, humidity_root)
					VALUES `

	for i, log := range logs {
		sqlStatement = sqlStatement + `(NOW(), ` + strconv.Itoa(log.ModuleID) + `,` + strconv.Itoa(log.Level) + `,` + util.FloatToString(log.TemperatureRoot) +
			`,` + util.FloatToString(log.HumidityRoot) + `)`

		if i < len(logs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err := db.Query(sqlStatement)
	if err != nil {
		return err
	}

	return nil
}

func UpdateRoomSensor(roomID int, temperature float64, humidity float64) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO log_sensor_room (logged_at, room_id, temperature, humidity) VALUES (NOW(), $1, $2, $3);`

	_, err := db.Query(sqlStatement, roomID, temperature, humidity)
	if err != nil {
		return err
	}

	return nil
}

func UpdateReservoirSensor(reservoirID int, tds float64, ph float64, temperatureSolution float64, solnLevel float64) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO log_sensor_reservoir (logged_at, reservoir_id, tds, ph, temperature_solution, soln_level) 
					VALUES (NOW(), $1, $2, $3, $4, $5);`

	_, err := db.Query(sqlStatement, reservoirID, tds, ph, temperatureSolution, solnLevel)
	if err != nil {
		return err
	}

	return nil
}
