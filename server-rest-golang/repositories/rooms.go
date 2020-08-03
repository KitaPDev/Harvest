package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
)

func GetAllRooms() ([]models.Room, error) {
	db := database.GetDB()

	sqlStatement := `SELECT room_id, room_label FROM room ORDER BY room_id;`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}

	rooms := make([]models.Room, 0)

	defer rows.Close()
	for rows.Next() {
		room := models.Room{}

		err = rows.Scan(
			&room.RoomID,
			&room.RoomLabel,
		)
		if err != nil {
			return nil, err
		}

		rooms = append(rooms, room)
	}

	return rooms, nil
}

func CreateRoom(roomLabel string) error {
	db := database.GetDB()

	sqlStatement := `INSERT INTO room (room_label) VALUES ($1);`

	_, err := db.Query(sqlStatement, roomLabel)
	if err != nil {
		return err
	}

	return nil
}

func EditRoom(roomID int, roomLabel string) error {
	db := database.GetDB()

	sqlStatement := `UPDATE room SET room_label = $1 WHERE room_id = $2;`

	_, err := db.Query(sqlStatement, roomLabel, roomID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteRoom(roomID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM room WHERE room_id = $1;`

	_, err := db.Query(sqlStatement, roomID)
	if err != nil {
		return err
	}

	return nil
}
