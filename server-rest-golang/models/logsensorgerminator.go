package models

import "time"

type LogSensorGerminator struct {
	LoggedAt        time.Time `json:"logged_at"`
	Temperature float64   `json:"temperature"`
	Humidity    float64   `json:"humidity"`
}
