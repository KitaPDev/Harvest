package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeIotHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/iot/update/module_level/sensor", controllers.UpdateModuleLevelSensor).
		Methods("POST")

	router.HandleFunc("/iot/update/room/sensor", controllers.UpdateRoomSensor).
		Methods("POST")

	router.HandleFunc("/iot/update/reservoir/sensor", controllers.UpdateReservoirSensor).
		Methods("POST")

	return router
}
