package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeUsersHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/users", controllers.PopulateUsers).
		Methods("GET")

	router.HandleFunc("/users/create", controllers.CreateUser).
		Methods("POST")

	router.HandleFunc("/users/change_password", controllers.ChangePassword).
		Methods("POST")

	router.HandleFunc("/users/change_username", controllers.ChangeUsername).
		Methods("POST")

	router.HandleFunc("/users/delete", controllers.DeleteUser).
		Methods("POST")

	router.HandleFunc("/users/assign_admin", controllers.AssignAdmin).
		Methods("POST")

	router.HandleFunc("/users/unassign_admin", controllers.UnassignAdmin).
		Methods("POST")

	return router
}
