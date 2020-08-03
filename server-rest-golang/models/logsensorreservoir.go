package models

import "time"

type LogSensorReservoir struct {
	LoggedAt    time.Time `json:"logged_at"`
	ReservoirID int       `json:"reservoir_id"`
	TDS         float64   `json:"tds"`
	PH          float64   `json:"ph"`
	SolnTemp    float64   `json:"soln_temp"`
	SolnLevel   float64   `json:"soln_level"`
}
