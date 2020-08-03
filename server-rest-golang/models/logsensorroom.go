package models

import "time"

type LogSensorRoom struct {
	LoggedAt    time.Time `json:"logged_at"`
	RoomID      int       `json:"room_id"`
	Temperature float64   `json:"temperature"`
	Humidity    float64   `json:"humidity"`
}
