package models

type GerminatorSettings struct {
	IsAuto       float64 `json:"is_auto"`
	HumidityLow  float64 `json:"humidity_low"`
	HumidityHigh float64 `json:"humidity_high"`
	LightOnHour  float64 `json:"lights_on_hour"`
	LightOffHour float64 `json:"lights_off_hour"`
	Pump         int     `json:"pump"`
	LED          int     `json:"led"`
}
