package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakePlantsHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/plants", controllers.PopulatePlants).
		Methods("GET")

	router.HandleFunc("/plants/create", controllers.CreatePlant).
		Methods("POST")

	router.HandleFunc("/plants/edit", controllers.EditPlant).
		Methods("POST")

	router.HandleFunc("/plants/delete", controllers.DeletePlant).
		Methods("POST")

	return router
}
