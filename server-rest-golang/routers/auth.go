package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeAuthHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/auth/login", controllers.Login).
		Methods("POST")

	router.HandleFunc("/auth/logout", controllers.Logout).
		Methods("POST")

	return router
}
