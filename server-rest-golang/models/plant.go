package models

type Plant struct {
	PlantID          int     `json:"plant_id"`
	PlantLabel       string  `json:"plant_label"`
	TDSHigh          float64 `json:"tds_high"`
	TDSLow           float64 `json:"tds_low"`
	PHHigh           float64 `json:"ph_high"`
	PHLow            float64 `json:"ph_low"`
	TemperatureHigh  float64 `json:"temperature_high"`
	TemperatureLow   float64 `json:"temperature_low"`
	LightsOffHour    float64 `json:"lights_off_hour"`
	LightsOnHour     float64 `json:"lights_on_hour"`
	MistingOffSecond float64 `json:"misting_off_second"`
	MistingOnSecond  float64 `json:"misting_on_second"`
}
