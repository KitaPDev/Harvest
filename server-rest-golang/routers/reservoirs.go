package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeReservoirsHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/reservoirs", controllers.PopulateReservoirs).
		Methods("GET")

	router.HandleFunc("/reservoirs/create", controllers.CreateReservoir).
		Methods("POST")

	router.HandleFunc("/reservoirs/edit", controllers.EditReservoir).
		Methods("POST")

	router.HandleFunc("/reservoirs/delete", controllers.DeleteReservoir).
		Methods("POST")

	return router
}
