package services

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/securecookie"
	"log"
	"net/http"
	"time"
)

type Claims struct {
	Username string
	jwt.StandardClaims
}

//var jwtKey = os.Getenv("SECRET_KEY_JWT")
var jwtKey = "abc" // for development
var secureCookie = securecookie.New([]byte(jwtKey), nil)

func AuthenticateToken(w http.ResponseWriter, r *http.Request, adminOnly bool) bool {
	cookie, err := r.Cookie("jwtToken")
	if err != nil {
		if err == http.ErrNoCookie {
			msg := "Error: No Token Found"
			http.Error(w, msg, http.StatusUnauthorized)
			log.Println(err)
			return false
		}

		msg := `Error: Failed to Retrieve Token from Cookie`
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return false
	}

	var tokenString string
	err = secureCookie.Decode("jwtToken", cookie.Value, &tokenString)
	if err != nil {
		msg := `Error: Failed to Decode Token Value`
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return false
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			msg := `Error: Invalid Signature`
			http.Error(w, msg, http.StatusUnauthorized)
			log.Println(err)
			return false
		}

		msg := `Error: Failed to Parse Token`
		http.Error(w, msg, http.StatusUnauthorized)
		http.Error(w, msg, http.StatusUnauthorized)
		log.Println(err)
		return false
	}

	if !token.Valid {
		msg := `Error: Invalid Token`
		http.Error(w, msg, http.StatusUnauthorized)
		return false
	}

	if adminOnly {
		user, err := GetUserByUsername(claims.Username)
		if err != nil {
			msg := "Error: Failed to Get User By Username"
			http.Error(w, msg, http.StatusInternalServerError)
			log.Println(err)
			return false
		}

		if !user.IsAdmin {
			msg := "Error: Admins Only"
			http.Error(w, msg, http.StatusUnauthorized)
			return false
		}
	}

	if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 0*time.Second {

		if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 10*time.Minute {
			InvalidateToken(w)
			log.Println("Token exceeded timeout")
			msg := "Error: Token Exceeded Timeout Limit, Sign In Again"
			http.Error(w, msg, http.StatusUnauthorized)
			return false

		} else {
			//log.Println("Username: ", claims.Username)
			err = GenerateToken(claims.Username, w)
			if err != nil {
				return false
			}
		}
	}

	return true
}

func GenerateToken(username string, w http.ResponseWriter) error {
	expirationTime := time.Now().Add(10 * time.Minute)
	claims := &Claims{
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(jwtKey))
	if err != nil {
		msg := "Error: Failed to Generate Token"
		http.Error(w, msg, http.StatusUnauthorized)
		return err
	}

	encoded, err := secureCookie.Encode("jwtToken", tokenString)
	if err != nil {
		msg := "Error: Failed to Encode Cookie"
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return err
	}

	cookie := &http.Cookie{
		Name:    "jwtToken",
		Value:   encoded,
		Expires: expirationTime,
		Path:    "/",
	}

	http.SetCookie(w, cookie)
	return nil
}

func InvalidateToken(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:    "jwtToken",
		Value:   "",
		Expires: time.Now(),
		Path:    "/",
	})
}

func GetUsernameFromCookie(w http.ResponseWriter, r *http.Request) (string, error) {
	cookie, err := r.Cookie("jwtToken")
	if err != nil {
		if err == http.ErrNoCookie {
			msg := "Error: No Token Found"
			http.Error(w, msg, http.StatusUnauthorized)
			log.Println(err)
			return "", err
		}

		msg := `Error: Failed to Retrieve Token from Cookie`
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return "", err
	}

	var tokenString string
	err = secureCookie.Decode("jwtToken", cookie.Value, &tokenString)
	if err != nil {
		msg := `Error: Failed to Decode Token Value`
		http.Error(w, msg, http.StatusInternalServerError)
		log.Println(err)
		return "", err
	}

	claims := &Claims{}
	_, err = jwt.ParseWithClaims(tokenString, claims,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtKey), nil
		})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			msg := `Error: Invalid Signature`
			http.Error(w, msg, http.StatusUnauthorized)
			log.Println(err)
			return "", err
		}

		msg := `Error: Failed to Parse Token`
		http.Error(w, msg, http.StatusUnauthorized)
		http.Error(w, msg, http.StatusUnauthorized)
		log.Println(err)
		return "", err
	}

	return claims.Username, nil
}
