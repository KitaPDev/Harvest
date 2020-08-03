package util

import "strconv"

func FloatToString(value float64) string {
	return strconv.FormatFloat(value, 'f', 6, 64)
}
