package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeNutrientsHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/nutrients", controllers.PopulateNutrients).
		Methods("GET")

	router.HandleFunc("/nutrients/create", controllers.CreateNutrient).
		Methods("POST")

	router.HandleFunc("/nutrients/edit", controllers.EditNutrient).
		Methods("POST")

	router.HandleFunc("/nutrients/delete", controllers.DeleteNutrient).
		Methods("POST")

	return router
}
