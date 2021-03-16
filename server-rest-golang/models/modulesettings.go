package models

type ModuleSettings struct {
	ModuleID         int     `json:"module_id"`
	IsAuto           int     `json:"is_auto"`
	IsWaterOnly      int     `json:"is_water_only"`
	LightOnTime      float64 `json:"light_on_time"`
	LightOffTime     float64 `json:"light_off_time"`
	HumidityRootLow  float64 `json:"humidity_root_low"`
	HumidityRootHigh float64 `json:"humidity_root_high"`
}
