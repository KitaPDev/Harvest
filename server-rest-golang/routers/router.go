package routers

import (
	"github.com/gorilla/mux"
)

func InitRoutes() *mux.Router {
	router := mux.NewRouter()

	router.PathPrefix("/auth").Handler(MakeAuthHandler())
	router.PathPrefix("/users").Handler(MakeUsersHandler())
	router.PathPrefix("/plants").Handler(MakePlantsHandler())
	router.PathPrefix("/nutrients").Handler(MakeNutrientsHandler())
	router.PathPrefix("/rooms").Handler(MakeRoomsHandler())
	router.PathPrefix("/reservoirs").Handler(MakeReservoirsHandler())
	router.PathPrefix("/modules").Handler(MakeModulesHandler())
	router.PathPrefix("/batches").Handler(MakeBatchesHandler())
	router.PathPrefix("/profile").Handler(MakeProfileHandler())
	router.PathPrefix("/dashboard").Handler(MakeDashboardHandler())
	router.PathPrefix("/iot").Handler(MakeIotHandler())

	return router
}
