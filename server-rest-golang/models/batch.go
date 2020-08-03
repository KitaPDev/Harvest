package models

import "time"

type Batch struct {
	BatchID          int       `json:"batch_id"`
	BatchLabel       string    `json:"batch_label"`
	ModuleIDs        []int     `json:"module_ids"`
	ReservoirIDs     []int     `json:"reservoir_ids"`
	RoomIDs          []int     `json:"room_ids"`
	PlantID          int       `json:"plant_id"`
	NutrientIDs      []int     `json:"nutrient_ids"`
	TimeStampBegin   time.Time `json:"time_stamp_begin"`
	TimeStampEnd     time.Time `json:"time_stamp_end"`
	Weight           float64   `json:"weight"`
	LightsOnHour     float64   `json:"lights_on_hour"`
	LightsOffHour    float64   `json:"lights_off_hour"`
	MistingOnSecond  float64   `json:"misting_on_second"`
	MistingOffSecond float64   `json:"misting_off_second"`
	Remarks          string    `json:"remarks"`
}
