package models

import "time"

type LogSensorModuleLevel struct {
	LoggedAt        time.Time `json:"logged_at"`
	ModuleID        int       `json:"module_id"`
	Level           int       `json:"level"`
	TemperatureRoot float64   `json:"temperature_root"`
	HumidityRoot    float64   `json:"humidity_root"`
}
