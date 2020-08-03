package services

import "github.com/Modern-Farms/server-rest-golang/models"

func GetPopulateProfileData(userID int) (*models.User, error) {
	return GetUserByID(userID)
}
