package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeDashboardHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/dashboard/grower", controllers.PopulateGrowerDashboard).
		Methods("POST")

	router.HandleFunc("/dashboard/grower/update", controllers.UpdateGrowerSensorLogs).
		Methods("POST")

	router.HandleFunc("/dashboard/germinator", controllers.PopulateGerminatorDashboard).
		Methods("POST")

	router.HandleFunc("/dashboard/history", controllers.History).
		Methods("POST")

	return router
}
