package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/lib/util"
	"github.com/Modern-Farms/server-rest-golang/models"
	"strconv"
)

func InitializeModule(moduleID int, remoteAddr string) (float64, float64, float64, float64, float64, float64, error) {
	db := database.GetDB()

	sqlStatement := `UPDATE module SET address = $2 WHERE module_id = $1;`

	_, err := db.Query(sqlStatement, moduleID, remoteAddr)
	if err != nil {
		return 0, 0, 0, 0, 0, 0, err
	}

	sqlStatement = `SELECT pressure_lower_limit, pressure_upper_limit, lights_off_hour, lights_on_hour, misting_off_second,
				misting_on_second FROM module WHERE module_id = $1;`

	rows, err := db.Query(sqlStatement, moduleID)
	if err != nil {
		return 0, 0, 0, 0, 0, 0, err
	}

	var pressureLowerLimit, pressureUpperLimit, lightsOffHour, lightsOnHour, mistingOffSecond, mistingOnSecond float64

	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(
			&pressureLowerLimit,
			&pressureUpperLimit,
			&lightsOffHour,
			&lightsOnHour,
			&mistingOffSecond,
			&mistingOnSecond,
		)
		if err != nil {
			return 0, 0, 0, 0, 0, 0, err
		}
	}

	return pressureLowerLimit, pressureUpperLimit, lightsOffHour, lightsOnHour, mistingOffSecond, mistingOnSecond, nil
}

func UpdateModuleSensor(logs []models.LogSensorModuleLevel) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO log_sensor_module (logged_at, module_id, level, temperature, humidity, lux)
					VALUES `

	for i, log := range logs {
		sqlStatement = sqlStatement + `(NOW(), ` + strconv.Itoa(log.ModuleID) + `,` + strconv.Itoa(log.Level) + `,` + util.FloatToString(log.Temperature) +
			`,` + util.FloatToString(log.Humidity) + `,` + util.FloatToString(log.Lux) + `)`

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

func UpdateReservoirSensor(reservoirID int, tds float64, ph float64, solnTemp float64, solnLevel float64) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO log_sensor_reservoir (logged_at, reservoir_id, tds, ph, soln_temp, soln_level) 
					VALUES (NOW(), $1, $2, $3, $4, $5);`

	_, err := db.Query(sqlStatement, reservoirID, tds, ph, solnTemp, solnLevel)
	if err != nil {
		return err
	}

	return nil
}
