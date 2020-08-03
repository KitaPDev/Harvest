package routers

import (
	"github.com/Modern-Farms/server-rest-golang/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

func MakeProfileHandler() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/profile", controllers.PopulateProfile).
		Methods("POST")

	router.HandleFunc("/profile/change_username", controllers.ChangeUsername).
		Methods("POST")

	router.HandleFunc("/profile/change_password", controllers.ChangePassword).
		Methods("POST")

	return router
}
