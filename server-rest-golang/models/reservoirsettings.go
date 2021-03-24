package models

type ReservoirSettings struct {
	ReservoirID int     `json:"reservoir_id"`
	IsAuto      int     `json:"is_auto"`
	TdsLow      int     `json:"tds_low"`
	TdsHigh     float64 `json:"tds_high"`
	PhLow       float64 `json:"ph_low"`
	PhHigh      float64 `json:"ph_high"`
	SvWater     float64 `json:"sv_water"`
	SvNutrient  float64 `json:"sv_nutrient"`
}
