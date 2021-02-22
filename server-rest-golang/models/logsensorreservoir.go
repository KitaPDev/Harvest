package models

import "time"

type LogSensorReservoir struct {
	LoggedAt            time.Time `json:"logged_at"`
	ReservoirID         int       `json:"reservoir_id"`
	TDS                 float64   `json:"tds"`
	PH                  float64   `json:"ph"`
	TemperatureSolution float64   `json:"temperature_solution"`
	SolnLevel           float64   `json:"soln_level"`
}
