package models

type Reservoir struct {
	ReservoirID    int    `json:"reservoir_id"`
	ReservoirLabel string `json:"reservoir_label"`
	NutrientIDs    []int  `json:"nutrient_ids"`
}
