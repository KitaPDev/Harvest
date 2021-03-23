package util

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"strconv"
)

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

func MaxKey_MapInt_LogSensorLevel(m map[int]models.LogSensorLevel) int {
	var max int
	for max = range m {
		break
	}

	for n := range m {
		if n > max {
			max = n
		}
	}

	return max
}