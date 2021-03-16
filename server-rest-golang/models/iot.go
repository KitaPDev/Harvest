package models

type IoTIsAutoSettingsInput struct {
	ApiKey           string  `json:"api_key"`
	ModuleID         int     `json:"module_id"`
	IsAuto           int     `json:"is_auto"`
	IsWaterOnly      int     `json:"is_water_only"`
	LightOnTime      float64 `json:"light_on_time"`
	LightOffTime     float64 `json:"light_off_time"`
	HumidityRootLow  float64 `json:"humidity_root_low"`
	HumidityRootHigh float64 `json:"humidity_root_high"`
}

type IoTModuleHardwareInput struct {
	ApiKey      string `json:"api_key"`
	IsAuto      int    `json:"is_auto"`
	IsWaterOnly int    `json:"is_water_only"`
	LED1        int    `json:"led_1"`
	LED2        int    `json:"led_2"`
	Fan1        int    `json:"fan_1"`
	Fan2        int    `json:"fan_2"`
	SV1         int    `json:"sv_1"`
	SV2         int    `json:"sv_2"`
}

type IoTReservoirHardwareInput struct {
	ApiKey      string `json:"api_key"`
	IsAuto      int    `json:"is_auto"`
	IsWaterOnly int    `json:"is_water_only"`
	SVWater     int    `json:"sv_water"`
	SVReservoir int    `json:"sv_reservoir"`
}

type IoTIsAutoSettingsBody struct {
	ModuleID         int     `json:"module_id"`
	IsAuto           int     `json:"is_auto"`
	IsWaterOnly      int     `json:"is_water_only"`
	LightOnTime      float64 `json:"light_on_time"`
	LightOffTime     float64 `json:"light_off_time"`
	HumidityRootLow  float64 `json:"humidity_root_low"`
	HumidityRootHigh float64 `json:"humidity_root_high"`
}

type IoTModuleHardwareBody struct {
	LED1 int `json:"led_1"`
	LED2 int `json:"led_2"`
	Fan1 int `json:"fan_1"`
	Fan2 int `json:"fan_2"`
	SV1  int `json:"sv_1"`
	SV2  int `json:"sv_2"`
}

type IoTReservoirHardwareBody struct {
	SVWater     int `json:"sv_water"`
	SVReservoir int `json:"sv_reservoir"`
}
