package models

type IoTInput struct {
	ApiKey      string `json:"api_key"`
	IsAuto      int    `json:"is_auto"`
	LED1        int    `json:"led_1"`
	LED2        int    `json:"led_2"`
	Fan1        int    `json:"fan_1"`
	Fan2        int    `json:"fan_2"`
	SVWater     int    `json:"sv_water"`
	SVReservoir int    `json:"sv_reservoir"`
	SV1         int    `json:"sv_1"`
	SV2         int    `json:"sv_2"`
}