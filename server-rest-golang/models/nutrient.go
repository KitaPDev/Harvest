package models

type Nutrient struct {
	NutrientID    int     `json:"nutrient_id"`
	NutrientLabel string  `json:"nutrient_label"`
	Part          int     `json:"part"`
	NutrientType  int     `json:"nutrient_type"`
	CCPerLiter    float64 `json:"cc_per_liter"`
	N             float64 `json:"n"`
	P             float64 `json:"p"`
	K             float64 `json:"k"`
}
