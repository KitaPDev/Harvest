package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/Modern-Farms/server-rest-golang/routers"
	"github.com/rs/cors"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	router := routers.InitRoutes()

	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4200"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost},
		AllowCredentials: true,
		AllowedHeaders:   []string{"*"},
	}).Handler(router)

	log.Println("Server is running")
	return http.ListenAndServe(getPort(), handler)
}

func getPort() string {
	var port = os.Getenv("PORT")
	if port == "" {
		port = "9090"
	}

	fmt.Println("Server is running on port: " + port)
	return ":" + port
}
