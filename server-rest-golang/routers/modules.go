package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeModulesHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/modules", controllers.PopulateModules).
		Methods("GET")

	router.HandleFunc("/modules/create", controllers.CreateModule).
		Methods("POST")

	router.HandleFunc("/modules/edit", controllers.EditModule).
		Methods("POST")

	router.HandleFunc("/modules/delete", controllers.DeleteModule).
		Methods("POST")

	return router
}
