package models

type LogSensorLevel struct {
	TemperatureRoot float64 `json:"temperature_root"`
	HumidityRoot    float64 `json:"humidity_root"`
}
