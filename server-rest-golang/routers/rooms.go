package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeRoomsHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/rooms", controllers.PopulateRooms).
		Methods("GET")

	router.HandleFunc("/rooms/create", controllers.CreateRoom).
		Methods("POST")

	router.HandleFunc("/rooms/edit", controllers.EditRoom).
		Methods("POST")

	router.HandleFunc("/rooms/delete", controllers.DeleteRoom).
		Methods("POST")

	return router
}
