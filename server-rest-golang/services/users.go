package services

import (
	"github.com/Modern-Farms/server-rest-golang/models"
	"github.com/Modern-Farms/server-rest-golang/repositories"
	"golang.org/x/crypto/bcrypt"
	"log"
)

func GetPopulateUsersData(username string) ([]models.User, error) {
	return repositories.GetPopulateUsersData(username)
}

func CreateUser(username string, password string, isAdmin bool) error {
	return repositories.CreateUser(username, password, isAdmin)
}

func GetUserByID(userID int) (*models.User, error) {
	user, err := repositories.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func GetUserByUsername(username string) (*models.User, error) {
	user, err := repositories.GetUserByUsername(username)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func CompareHashAndPassword(user *models.User, password string) bool {
	if bcrypt.CompareHashAndPassword([]byte(user.Hash), []byte(password+user.Salt)) == nil {
		return true
	}

	return false
}

func ValidateSignIn(username string, password string) (*models.User, bool, error) {
	user, err := GetUserByUsername(username)

	if user == nil {
		return nil, false, err
	}

	if err != nil {
		log.Println(err)
		return nil, false, err
	}

	if !CompareHashAndPassword(user, password) {
		return nil, false, err
	}

	return user, true, nil
}

func ChangePassword(user *models.User, newPassword string) error {
	return repositories.ChangePassword(user, newPassword)
}

func ChangeUsername(userID int, newUsername string) error {
	return repositories.ChangeUsername(userID, newUsername)
}

func DeleteUser(userID int) error {
	return repositories.DeleteUser(userID)
}

func AssignAdmin(userID int) error {
	return repositories.AssignAdmin(userID)
}

func UnassignAdmin(userID int) error {
	return repositories.UnassignAdmin(userID)
}
