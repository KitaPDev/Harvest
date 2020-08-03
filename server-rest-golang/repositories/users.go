package repositories

import (
	"github.com/Modern-Farms/server-rest-golang/lib/database"
	"github.com/Modern-Farms/server-rest-golang/models"
	"golang.org/x/crypto/bcrypt"
	"math/rand"
	"time"
)

func GetPopulateUsersData(username string) ([]models.User, error) {
	db := database.GetDB()

	sqlStatement := `SELECT user_id, username, is_admin, created_at FROM users WHERE username != $1 ORDER BY created_at DESC;`

	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return nil, err
	}

	users := make([]models.User, 0)

	defer rows.Close()
	for rows.Next() {
		user := models.User{}

		err := rows.Scan(
			&user.UserID,
			&user.Username,
			&user.IsAdmin,
			&user.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		users = append(users, user)
	}

	return users, nil
}

func CreateUser(username string, password string, isAdmin bool) error {
	db := database.GetDB()

	salt := generateSalt()
	hash, err := hash(password, salt)
	if err != nil {
		return err
	}

	sqlStatement := `INSERT INTO users (username, hash, salt, is_admin) 
		VALUES ($1, $2, $3, $4);`

	_, err = db.Query(sqlStatement, username, hash, salt, isAdmin)

	return err
}

func GetUserByUsername(username string) (*models.User, error) {
	db := database.GetDB()

	sqlStatement := `SELECT user_id, username, hash, salt, is_admin, created_at FROM users WHERE username = $1;`

	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return nil, err
	}

	var user models.User

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&user.UserID,
			&user.Username,
			&user.Hash,
			&user.Salt,
			&user.IsAdmin,
			&user.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

	}

	return &user, nil
}

func GetUserByID(userID int) (*models.User, error) {
	db := database.GetDB()

	sqlStatement := `SELECT user_id, username, hash, salt, is_admin, created_at FROM users WHERE user_id = $1;`

	rows, err := db.Query(sqlStatement, userID)
	if err != nil {
		return nil, err
	}

	var user models.User

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&user.UserID,
			&user.Username,
			&user.Hash,
			&user.Salt,
			&user.IsAdmin,
			&user.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

	}

	return &user, nil
}

func ChangePassword(user *models.User, newPassword string) error {
	db := database.GetDB()

	hash, err := hash(newPassword, user.Salt)
	if err != nil {
		return err
	}

	sqlStatement := `UPDATE users SET hash = $1 WHERE user_id = $2;`

	_, err = db.Query(sqlStatement, hash, user.UserID)
	if err != nil {
		return err
	}

	return nil
}

func ChangeUsername(userID int, newUsername string) error {
	db := database.GetDB()

	sqlStatement := `UPDATE users SET username = $1 WHERE user_id = $2;`

	_, err := db.Query(sqlStatement, newUsername, userID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteUser(userID int) error {
	db := database.GetDB()

	sqlStatement := `DELETE FROM users WHERE user_id = $1;`

	_, err := db.Query(sqlStatement, userID)
	if err != nil {
		return err
	}

	return nil
}

func AssignAdmin(userID int) error {
	db := database.GetDB()

	sqlStatement := `UPDATE users SET is_admin = TRUE WHERE user_id = $1;`

	_, err := db.Query(sqlStatement, userID)
	if err != nil {
		return err
	}

	return nil
}

func UnassignAdmin(userID int) error {
	db := database.GetDB()

	sqlStatement := `UPDATE users SET is_admin = FALSE WHERE user_id = $1;`

	_, err := db.Query(sqlStatement, userID)
	if err != nil {
		return err
	}

	return nil
}

func generateSalt() string {
	charset := "abcdefghijklmnopqrstuvwxyz" +
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	seededRand := rand.New(
		rand.NewSource(time.Now().UnixNano()))

	salt := make([]byte, 32)
	for i := range salt {
		salt[i] = charset[seededRand.Intn(len(charset))]
	}

	return string(salt)
}

func hash(password string, salt string) (string, error) {
	s := password + salt
	h, err := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(h), nil
}
