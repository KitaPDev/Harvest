package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeDashboardHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/dashboard/grower/current", controllers.PopulateGrowerDashboardCurrent).
		Methods("GET")

	router.HandleFunc("/dashboard/grower/sensor/latest", controllers.GetLatestGrowerSensorLogs).
		Methods("GET")

	router.HandleFunc("/dashboard/grower/history", controllers.PopulateGrowerDashboardHistory).
		Methods("POST")

	router.HandleFunc("/dashboard/module/update", controllers.UpdateModuleSettings).
		Methods("POST")

	router.HandleFunc("/dashboard/module", controllers.GetModuleSettings).
		Methods("POST")

	router.HandleFunc("/dashboard/reservoir/update", controllers.UpdateReservoirSettings).
		Methods("POST")

	router.HandleFunc("/dashboard/reservoir", controllers.GetReservoirSettings).
		Methods("POST")

	router.HandleFunc("/dashboard/germinator/current", controllers.PopulateGerminatorDashboardCurrent).
		Methods("GET")

	router.HandleFunc("/dashboard/germinator/history", controllers.PopulateGerminatorDashboardHistory).
		Methods("POST")

	router.HandleFunc("/dashboard/germinator/update", controllers.UpdateGerminatorSettings).
		Methods("POST")

	router.HandleFunc("/dashboard/germinator", controllers.GetGerminatorSettings).
		Methods("POST")

	return router
}
