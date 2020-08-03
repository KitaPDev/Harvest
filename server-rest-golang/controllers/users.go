package controllers

import (
	"encoding/json"
	"github.com/Modern-Farms/server-rest-golang/lib/jsonhandler"
	"github.com/Modern-Farms/server-rest-golang/services"
	"log"
	"net/http"
)

func PopulateUsers(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	username, err := services.GetUsernameFromCookie(w, r)
	if err != nil {
		return
	}

	users, err := services.GetPopulateUsersData(username)
	if err != nil {
		msg := "Error: Failed to Get Populate Users Data"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	jsonData, err := json.Marshal(users)
	if err != nil {
		msg := "Error: Failed to marshal JSON"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonData)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		Username string `json:"username"`
		Password string `json:"password"`
		IsAdmin  bool   `json:"is_admin"`
	}
	input := Input{}

	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.CreateUser(input.Username, input.Password, input.IsAdmin)
	if err != nil {
		msg := "Error: Failed to Create User"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ChangePassword(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		UserID      int    `json:"user_id"`
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	input := Input{}
	jsonhandler.DecodeJsonFromBody(w, r, &input)

	user, err := services.GetUserByID(input.UserID)
	if err != nil {
		msg := "Error: Failed to Get User By ID"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	valid := services.CompareHashAndPassword(user, input.OldPassword)
	if !valid {
		msg := "Error: Wrong Old Password"
		http.Error(w, msg, http.StatusUnauthorized)
		log.Println(err)
		return
	}

	err = services.ChangePassword(user, input.NewPassword)
	if err != nil {
		msg := "Error: Failed to Change Password"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func ChangeUsername(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, false) {
		return
	}

	type Input struct {
		UserID      int    `json:"user_id"`
		NewUsername string `json:"new_username"`
	}

	input := Input{}
	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.ChangeUsername(input.UserID, input.NewUsername)
	if err != nil {
		msg := "Error: Failed to Change Username"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		UserID int `json:"user_id"`
	}

	input := Input{}
	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.DeleteUser(input.UserID)
	if err != nil {
		msg := "Error: Failed to Delete User"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func AssignAdmin(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		UserID int `json:"user_id"`
	}

	input := Input{}
	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.AssignAdmin(input.UserID)
	if err != nil {
		msg := "Error: Failed to Assign Admin"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func UnassignAdmin(w http.ResponseWriter, r *http.Request) {
	if !services.AuthenticateToken(w, r, true) {
		return
	}

	type Input struct {
		UserID int `json:"user_id"`
	}

	input := Input{}
	jsonhandler.DecodeJsonFromBody(w, r, &input)

	err := services.UnassignAdmin(input.UserID)
	if err != nil {
		msg := "Error: Failed to Unassign Admin"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
