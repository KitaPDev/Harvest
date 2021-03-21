package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeIotHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/iot/update/module/sensor", controllers.UpdateModuleSensor).
		Methods("POST")

	router.HandleFunc("/iot/update/room/sensor", controllers.UpdateRoomSensor).
		Methods("POST")

	router.HandleFunc("/iot/update/reservoir/sensor", controllers.UpdateReservoirSensor).
		Methods("POST")

	// For testing only!
	router.HandleFunc("/iot/test", controllers.IoTTest).Methods("POST")
	router.HandleFunc("/iot/test/server", controllers.IoTServerTest).Methods("POST")

	return router
}
