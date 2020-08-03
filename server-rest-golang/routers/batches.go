package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeBatchesHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/batches", controllers.PopulateBatches).
		Methods("GET")

	router.HandleFunc("/batches/create", controllers.CreateBatch).
		Methods("POST")

	router.HandleFunc("/batches/edit", controllers.EditBatch).
		Methods("POST")

	router.HandleFunc("/batches/delete", controllers.DeleteBatch).
		Methods("POST")

	router.HandleFunc("/batches/details", controllers.BatchDetails).
		Methods("POST")

	return router
}
