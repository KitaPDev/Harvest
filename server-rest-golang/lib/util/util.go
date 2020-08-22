package util

import "strconv"

type IntSlice []int

func FloatToString(value float64) string {
	return strconv.FormatFloat(value, 'f', 6, 64)
}

func IntSliceContains(s IntSlice, x int) bool {
	for _, a := range s {
		if x == a {
			return true
		}
	}
	return false
}
