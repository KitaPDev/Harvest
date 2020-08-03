package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeDashboardHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/dashboard", controllers.PopulateDashboard).
		Methods("GET")

	router.HandleFunc("/dashboard/update_sensor_logs", controllers.UpdateSensorLogs).
		Methods("GET")

	router.HandleFunc("/dashboard/history", controllers.History).
		Methods("POST")

	return router
}
