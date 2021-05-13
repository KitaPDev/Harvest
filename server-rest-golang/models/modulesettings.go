package models

type ModuleSettings struct {
	ModuleID         int     `json:"module_id"`
	IsAuto           int     `json:"is_auto"`
	LightsOnHour     float64 `json:"lights_on_hour"`
	LightsOffHour    float64 `json:"lights_off_hour"`
	HumidityRootLow  float64 `json:"humidity_root_low"`
	HumidityRootHigh float64 `json:"humidity_root_high"`
	Led1             int     `json:"led_1"`
	Led2             int     `json:"led_2"`
	Fan1             int     `json:"fan_1"`
	Fan2             int     `json:"fan_2"`
	Sv1              int     `json:"sv_1"`
	Sv2              int     `json:"sv_2"`
}
