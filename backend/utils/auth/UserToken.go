package auth

import (
	"time"

	"github.com/go-jose/go-jose/v4"
	"github.com/go-jose/go-jose/v4/jwt"

	"utils/crypto"
)

func GenerateToken(data string, durationHours time.Duration) (string, error) {
	secret, err := crypto.GenerateRandomKey(32)
	if err != nil {
		return "", err
	}


	sig, err := jose.NewSigner(jose.SigningKey{Algorithm: jose.HS256, Key: secret}, nil)
	if err != nil {
		return "", err
	}

	claims := jwt.Claims{
		Subject:   data,
		Expiry:    jwt.NewNumericDate(time.Now().Add(durationHours * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
	}

	rawJWT, err := jwt.Signed(sig).Claims(claims).Serialize()
	if err != nil {
		return "", err
	}

	return rawJWT, nil
}