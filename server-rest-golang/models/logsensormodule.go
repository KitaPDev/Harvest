package models

import "time"

type LogSensorModuleLevel struct {
	LoggedAt    time.Time `json:"logged_at"`
	ModuleID    int       `json:"module_id"`
	Level       int       `json:"level"`
	Temperature float64   `json:"temperature"`
	Humidity    float64   `json:"humidity"`
}
