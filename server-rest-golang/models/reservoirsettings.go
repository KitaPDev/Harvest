package models

type ReservoirSettings struct {
	ReservoirID int     `json:"reservoir_id"`
	SvWater     float64 `json:"sv_water"`
	SvNutrient  float64 `json:"sv_nutrient"`
}
