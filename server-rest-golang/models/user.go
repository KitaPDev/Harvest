package models

import (
	"time"
)

type Role string

type User struct {
	UserID    int       `json:"user_id"`
	Username  string    `json:"username"`
	IsAdmin   bool      `json:"is_admin"`
	Hash      string    `json:""`
	Salt      string    `json:""`
	CreatedAt time.Time `json:"created_at"`
}
