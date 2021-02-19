package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var db *sql.DB

const (
	HOST = "localhost"
	PORT = 5432
	USER = "admin"
	PASS = "modernfarms"
	NAME = "modernfarms"
	SSL  = "disable"
)

func GetDB() *sql.DB {
	var err error

	if db == nil {
		connectionString := fmt.Sprintf("port=%d host=%s user=%s "+
			"password=%s dbname=%s sslmode=%s",
			PORT, HOST, USER, PASS, NAME, SSL)

		db, err = sql.Open("postgres", connectionString)
		if err != nil {
			panic(err)
		}
	}

	return db
}
