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

	router.HandleFunc("/dashboard/module/update/is_auto", controllers.UpdateModuleIsAuto).
		Methods("POST")

	router.HandleFunc("/dashboard/germinator/current", controllers.PopulateGerminatorDashboardCurrent).
		Methods("GET")

	router.HandleFunc("/dashboard/germinator/history", controllers.PopulateGerminatorDashboardHistory).
		Methods("POST")

	return router
}
