package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/lib/util"
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/lib/pq"
	"strconv"
	"time"
)

func GetAllBatches() ([]models.Batch, error) {
	db := database.GetDB()

	sqlStatement := `SELECT batch_id, nutrient_id FROM batches_nutrients;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	mapBatchIDNutrientIDs := make(map[int][]int, 0)

	defer rows.Close()
	for rows.Next() {
		var batchID, nutrientID int

		err = rows.Scan(
			&batchID,
			&nutrientID,
		)
		if err != nil {
			return nil, err
		}

		mapBatchIDNutrientIDs[batchID] = append(mapBatchIDNutrientIDs[batchID], nutrientID)
	}

	sqlStatement = `SELECT batch_id, module_id FROM batches_modules;`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	mapBatchIDModuleIDs := make(map[int][]int, 0)

	defer rows.Close()
	for rows.Next() {
		var batchID, moduleID int

		err = rows.Scan(
			&batchID,
			&moduleID,
		)
		if err != nil {
			return nil, err
		}

		mapBatchIDModuleIDs[batchID] = append(mapBatchIDModuleIDs[batchID], moduleID)
	}

	sqlStatement = `SELECT batch_id, reservoir_id FROM batches_reservoirs;`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	mapBatchIDReservoirIDs := make(map[int][]int, 0)

	defer rows.Close()
	for rows.Next() {
		var batchID, reservoirID int

		err = rows.Scan(
			&batchID,
			&reservoirID,
		)
		if err != nil {
			return nil, err
		}

		mapBatchIDReservoirIDs[batchID] = append(mapBatchIDReservoirIDs[batchID], reservoirID)
	}

	sqlStatement = `SELECT batch_id, room_id FROM batches_rooms;`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	mapBatchIDRoomIDs := make(map[int][]int, 0)

	defer rows.Close()
	for rows.Next() {
		var batchID, roomID int

		err = rows.Scan(
			&batchID,
			&roomID,
		)
		if err != nil {
			return nil, err
		}

		mapBatchIDRoomIDs[batchID] = append(mapBatchIDRoomIDs[batchID], roomID)
	}

	sqlStatement = `SELECT batch_id, batch_label, plant_id, timestamp_begin, timestamp_end, weight,
       lights_on_hour, lights_off_hour, misting_on_second, misting_off_second, remarks FROM batch;`

	rows, err = db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	batches := make([]models.Batch, 0)

	defer rows.Close()
	for rows.Next() {
		batch := models.Batch{}

		err = rows.Scan(
			&batch.BatchID,
			&batch.BatchLabel,
			&batch.PlantID,
			&batch.TimeStampBegin,
			&batch.TimeStampEnd,
			&batch.Weight,
			&batch.LightsOnHour,
			&batch.LightsOffHour,
			&batch.MistingOnSecond,
			&batch.MistingOffSecond,
			&batch.Remarks,
		)
		if err != nil {
			return nil, err
		}

		batch.NutrientIDs = mapBatchIDNutrientIDs[batch.BatchID]
		batch.ModuleIDs = mapBatchIDModuleIDs[batch.BatchID]
		batch.RoomIDs = mapBatchIDRoomIDs[batch.BatchID]
		batch.ReservoirIDs = mapBatchIDReservoirIDs[batch.BatchID]

		batches = append(batches, batch)
	}

	return batches, nil
}

func CreateBatch(batchLabel string, plantID int, reservoirIDs []int, nutrientIDs []int, moduleIDs []int, roomIDs []int, timestampBegin time.Time,
	timestampEnd time.Time, weight float64, lightsOnHour float64, lightsOffHour float64, mistingOnHour float64, mistingOffHour float64,
	remarks string) error {

	db := database.GetDB()

	sqlStatement := `INSERT INTO batch (batch_label, plant_id, timestamp_begin, timestamp_end, weight,
                   lights_on_hour, lights_off_hour, misting_on_second, misting_off_second, remarks)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`

	_, err := db.Query(sqlStatement, batchLabel, plantID, timestampBegin, timestampEnd, weight,
		lightsOnHour, lightsOffHour, mistingOnHour, mistingOffHour, remarks)
	if err != nil {
		return err
	}

	sqlStatement = `SELECT batch_id FROM batch WHERE batch_label = $1 AND timestamp_begin = $2 AND timestamp_end = $3;`

	rows, err := db.Query(sqlStatement, batchLabel, timestampBegin, timestampEnd)
	if err != nil {
		return err
	}

	var batchID int

	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(
			&batchID,
		)
		if err != nil {
			return err
		}
	}

	sqlStatement = `INSERT INTO batches_nutrients (batch_id, nutrient_id) VALUES `

	for i, nutrientID := range nutrientIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(nutrientID) + `)`

		if i < len(nutrientIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_modules (batch_id, module_id) VALUES `

	for i, moduleID := range moduleIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(moduleID) + `)`

		if i < len(moduleIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_reservoirs (batch_id, reservoir_id) VALUES `

	for i, reservoirID := range reservoirIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(reservoirID) + `)`

		if i < len(reservoirIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_rooms (batch_id, room_id) VALUES `

	for i, roomID := range roomIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(roomID) + `)`

		if i < len(roomIDs)-1 {
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

func EditBatch(batchID int, plantID int, reservoirIDs []int, nutrientIDs []int, moduleIDs []int, roomIDs []int, timestampBegin time.Time,
	timestampEnd time.Time, weight float64, lightsOnHour float64, lightsOffHour float64, mistingOnHour float64, mistingOffHour float64,
	remarks string) error {

	db := database.GetDB()

	sqlStatement := `UPDATE batch 
			SET plant_id = $2,
			    timestamp_begin = $3,
			    timestamp_end = $4,
			    weight = $5,
			    lights_on_hour = $6,
			    lights_off_hour = $7,
			    misting_on_second = $8,
			    misting_off_second = $9,
			    remarks = $10
			WHERE batch_id = $1;`

	_, err := db.Query(sqlStatement, batchID, plantID, timestampBegin, timestampEnd, weight, lightsOnHour,
		lightsOffHour, mistingOnHour, mistingOffHour, remarks)
	if err != nil {
		return err
	}

	sqlStatement = `DELETE FROM batches_nutrients WHERE batch_id = $1;`

	_, err = db.Query(sqlStatement, batchID)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_nutrients (batch_id, nutrient_id) VALUES `

	for i, nutrientID := range nutrientIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(nutrientID) + `)`

		if i < len(nutrientIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	sqlStatement = `DELETE FROM batches_modules WHERE batch_id = $1;`

	_, err = db.Query(sqlStatement, batchID)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_modules (batch_id, module_id) VALUES `

	for i, moduleID := range moduleIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(moduleID) + `)`

		if i < len(moduleIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	sqlStatement = `DELETE FROM batches_reservoirs WHERE batch_id = $1;`

	_, err = db.Query(sqlStatement, batchID)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_reservoirs (batch_id, reservoir_id) VALUES `

	for i, reservoirID := range reservoirIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(reservoirID) + `)`

		if i < len(reservoirIDs)-1 {
			sqlStatement = sqlStatement + `, `
		}
	}

	sqlStatement = sqlStatement + `;`

	_, err = db.Query(sqlStatement)
	if err != nil {
		return err
	}

	sqlStatement = `DELETE FROM batches_rooms WHERE batch_id = $1;`

	_, err = db.Query(sqlStatement, batchID)
	if err != nil {
		return err
	}

	sqlStatement = `INSERT INTO batches_rooms (batch_id, room_id) VALUES `

	for i, roomID := range roomIDs {
		sqlStatement = sqlStatement + `(` + strconv.Itoa(batchID) + `,` + strconv.Itoa(roomID) + `)`

		if i < len(roomIDs)-1 {
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

func DeleteBatch(batchID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM batch WHERE batch_id = $1;`

	_, err := db.Query(sqlStatement, batchID)
	if err != nil {
		return err
	}

	return nil
}

func GetBatchSensorData(batchID int) ([]models.LogSensorModuleLevel, []models.LogSensorReservoir, []models.LogSensorRoom, error) {
	db := database.GetDB()

	sqlStatement := `SELECT batch_id, plant_id, timestamp_begin, timestamp_end FROM batch
			WHERE batch_id = $1;`

	rows, err := db.Query(sqlStatement, batchID)
	if err != nil {
		return nil, nil, nil, err
	}

	batch := models.Batch{}

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&batch.BatchID,
			&batch.PlantID,
			&batch.TimeStampBegin,
			&batch.TimeStampEnd,
		)
		if err != nil {
			return nil, nil, nil, err
		}
	}

	sqlStatement = `SELECT bm.module_id, brs.reservoir_id, bro.room_id FROM batches_modules bm, batches_reservoirs brs, batches_rooms bro 
			WHERE bm.batch_id = $1 AND brs.batch_id = $1 AND bro.batch_id = $1;`

	rows, err = db.Query(sqlStatement, batchID)
	if err != nil {
		return nil, nil, nil, err
	}

	moduleIDs := make([]int, 0)
	reservoirIDs := make([]int, 0)
	roomIDs := make([]int, 0)

	defer rows.Close()
	for rows.Next() {
		var moduleID, reservoirID, roomID int

		err = rows.Scan(
			&moduleID,
			&reservoirID,
			&roomID,
		)
		if err != nil {
			return nil, nil, nil, err
		}

		if !util.IntSliceContains(moduleIDs, moduleID) {
			moduleIDs = append(moduleIDs, moduleID)
		}

		if !util.IntSliceContains(reservoirIDs, reservoirID) {
			reservoirIDs = append(reservoirIDs, reservoirID)
		}

		if !util.IntSliceContains(roomIDs, roomID) {
			roomIDs = append(roomIDs, roomID)
		}
	}

	logSensorModuleLevels := make([]models.LogSensorModuleLevel, 0)

	for _, moduleID := range moduleIDs {
		sqlStatement = `SELECT logged_at, module_id, level, temperature_root, humidity_root
			FROM log_sensor_module 
			WHERE module_id = $1 
			  AND logged_at >= $2 
			  AND logged_at <= $3
			ORDER BY (logged_at);`

		rows, err = db.Query(sqlStatement, moduleID, pq.FormatTimestamp(batch.TimeStampBegin), pq.FormatTimestamp(batch.TimeStampEnd))
		if err != nil {
			return nil, nil, nil, err
		}

		for rows.Next() {
			logSensorModuleLevel := models.LogSensorModuleLevel{}

			err = rows.Scan(
				&logSensorModuleLevel.LoggedAt,
				&logSensorModuleLevel.ModuleID,
				&logSensorModuleLevel.Level,
				&logSensorModuleLevel.TemperatureRoot,
				&logSensorModuleLevel.HumidityRoot,
			)
			if err != nil {
				return nil, nil, nil, err
			}

			logSensorModuleLevels = append(logSensorModuleLevels, logSensorModuleLevel)
		}
	}

	logSensorReservoirs := make([]models.LogSensorReservoir, 0)

	for _, reservoirID := range reservoirIDs {
		sqlStatement = `SELECT logged_at, reservoir_id, tds, soln_temp, soln_level, ph
			FROM log_sensor_reservoir
			WHERE reservoir_id = $1 
			  AND logged_at >= $2 
			  AND logged_at <= $3
			ORDER BY (logged_at);`

		rows, err = db.Query(sqlStatement, reservoirID, pq.FormatTimestamp(batch.TimeStampBegin), pq.FormatTimestamp(batch.TimeStampEnd))
		if err != nil {
			return nil, nil, nil, err
		}

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
	}

	logSensorRooms := make([]models.LogSensorRoom, 0)

	for _, roomID := range roomIDs {
		sqlStatement = `SELECT logged_at, room_id, temperature, humidity
			FROM log_sensor_room 
			WHERE room_id = $1 
			  AND logged_at >= $2 
			  AND logged_at <= $3
			ORDER BY (logged_at);`

		rows, err = db.Query(sqlStatement, roomID, pq.FormatTimestamp(batch.TimeStampBegin), pq.FormatTimestamp(batch.TimeStampEnd))
		if err != nil {
			return nil, nil, nil, err
		}

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
	}

	return logSensorModuleLevels, logSensorReservoirs, logSensorRooms, nil
}
