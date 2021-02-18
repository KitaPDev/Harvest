package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
	"time"
)

func GetLatestSensorLog() ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom,
	error) {

	db := database.GetDB()

	moduleLevelLogs := make([]models.LogSensorModuleLevel, 0)
	reservoirLogs := make([]models.LogSensorReservoir, 0)
	roomLogs := make([]models.LogSensorRoom, 0)

	sqlStatement :=
		`SELECT DISTINCT ON (module_id, level) logged_at, module_id, level, temperature_root, humidity_root, lux
		FROM log_sensor_module
		ORDER BY module_id, level, logged_at DESC;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, nil, nil, err
	}

	defer rows.Close()
	for rows.Next() {
		moduleLevelLog := models.LogSensorModuleLevel{}

		err := rows.Scan(
			&moduleLevelLog.LoggedAt,
			&moduleLevelLog.ModuleID,
			&moduleLevelLog.Level,
			&moduleLevelLog.TemperatureRoot,
			&moduleLevelLog.HumidityRoot,
			&moduleLevelLog.Lux,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		moduleLevelLogs = append(moduleLevelLogs, moduleLevelLog)
	}

	sqlStatement =
		`SELECT DISTINCT ON (reservoir_id) logged_at, reservoir_id, tds, soln_temp, soln_level
		FROM log_sensor_reservoir
		ORDER BY reservoir_id, logged_at DESC;`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, nil, nil, err
	}

	defer rows.Close()
	for rows.Next() {
		reservoirLog := models.LogSensorReservoir{}

		err := rows.Scan(
			&reservoirLog.LoggedAt,
			&reservoirLog.ReservoirID,
			&reservoirLog.TDS,
			&reservoirLog.SolnTemp,
			&reservoirLog.SolnLevel,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		reservoirLogs = append(reservoirLogs, reservoirLog)
	}

	sqlStatement =
		`SELECT DISTINCT ON (room_id) logged_at, room_id, temperature, humidity
		FROM log_sensor_room
		ORDER BY room_id, logged_at DESC;`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, nil, nil, err
	}

	defer rows.Close()
	for rows.Next() {
		roomLog := models.LogSensorRoom{}

		err := rows.Scan(
			&roomLog.LoggedAt,
			&roomLog.RoomID,
			&roomLog.Temperature,
			&roomLog.Humidity,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		roomLogs = append(roomLogs, roomLog)
	}

	return moduleLevelLogs, reservoirLogs, roomLogs, nil
}

func GetHistorySensorLogData(timestampBegin time.Time, timestampEnd time.Time) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir,
	[]models.LogSensorRoom, error) {

	db := database.GetDB()

	sqlStatement := `SELECT logged_at, module_id, level, temperature_root, humidity_root, lux
			FROM log_sensor_module 
			WHERE logged_at >= $1 
			  AND logged_at <= $2;`

	rows, err := db.Query(sqlStatement, timestampBegin, timestampEnd)
	if err != nil {
		return nil, nil, nil, err
	}

	logSensorModuleLevels := make([]models.LogSensorModuleLevel, 0)

	defer rows.Close()
	for rows.Next() {
		logSensorModuleLevel := models.LogSensorModuleLevel{}

		err = rows.Scan(
			&logSensorModuleLevel.LoggedAt,
			&logSensorModuleLevel.ModuleID,
			&logSensorModuleLevel.Level,
			&logSensorModuleLevel.TemperatureRoot,
			&logSensorModuleLevel.HumidityRoot,
			&logSensorModuleLevel.Lux,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		logSensorModuleLevels = append(logSensorModuleLevels, logSensorModuleLevel)
	}

	sqlStatement = `SELECT logged_at, reservoir_id, tds, soln_temp, soln_level, ph
			FROM log_sensor_reservoir
			WHERE logged_at >= $1 
			  AND logged_at <= $2;`

	rows, err = db.Query(sqlStatement, timestampBegin, timestampEnd)
	if err != nil {
		return nil, nil, nil, err
	}

	logSensorReservoirs := make([]models.LogSensorReservoir, 0)

	defer rows.Close()
	for rows.Next() {
		logSensorReservoir := models.LogSensorReservoir{}

		err = rows.Scan(
			&logSensorReservoir.LoggedAt,
			&logSensorReservoir.ReservoirID,
			&logSensorReservoir.TDS,
			&logSensorReservoir.SolnTemp,
			&logSensorReservoir.SolnLevel,
			&logSensorReservoir.PH,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		logSensorReservoirs = append(logSensorReservoirs, logSensorReservoir)
	}

	sqlStatement = `SELECT logged_at, room_id, temperature, humidity
			FROM log_sensor_room
			WHERE logged_at >= $1 
			  AND logged_at <= $2;`

	rows, err = db.Query(sqlStatement, timestampBegin, timestampEnd)
	if err != nil {
		return nil, nil, nil, err
	}

	logSensorRooms := make([]models.LogSensorRoom, 0)

	defer rows.Close()
	for rows.Next() {
		logSensorRoom := models.LogSensorRoom{}

		err = rows.Scan(
			&logSensorRoom.LoggedAt,
			&logSensorRoom.RoomID,
			&logSensorRoom.Temperature,
			&logSensorRoom.Humidity,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		logSensorRooms = append(logSensorRooms, logSensorRoom)
	}

	return logSensorModuleLevels, logSensorReservoirs, logSensorRooms, nil
}
