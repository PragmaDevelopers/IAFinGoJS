package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"

	"github.com/go-jose/go-jose/v4"
)

// ByteArray is a custom type for handling []byte serialization as an array of numbers
type ByteArray []byte

// MarshalJSON implements the json.Marshaler interface
func (b ByteArray) MarshalJSON() ([]byte, error) {
	ints := make([]int, len(b))
	for i, v := range b {
		ints[i] = int(v)
	}
	return json.Marshal(ints)
}

// UnmarshalJSON implements the json.Unmarshaler interface
func (b *ByteArray) UnmarshalJSON(data []byte) error {
	var ints []int
	if err := json.Unmarshal(data, &ints); err != nil {
		return err
	}
	*b = make([]byte, len(ints))
	for i, v := range ints {
		(*b)[i] = byte(v)
	}
	return nil
}

// JSONData represents the structure of the JSON data
type JSONData struct {
	Data string         `json:"data"`
	IV   ByteArray      `json:"iv"`
	Key  *jose.JSONWebKey `json:"key"`
}

// EncryptData encrypts data using AES-GCM with the provided key
func encryptData(data string, key *jose.JSONWebKey) (string, error) {
	block, err := aes.NewCipher(key.Key.([]byte))
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	iv := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	encryptedData := gcm.Seal(nil, iv, []byte(data), nil)

	finalDataJSON := JSONData{
		Data: base64.StdEncoding.EncodeToString(encryptedData),
		IV:   ByteArray(iv),
		Key:  key,
	}

	finalDataBytes, err := json.Marshal(finalDataJSON)
	if err != nil {
		return "", err
	}

	finalb64String := base64.StdEncoding.EncodeToString(finalDataBytes)
	reversedData := reverseString(finalb64String)
	return reversedData, nil
}

func EncryptData(data string) (string, error) {
	key, e := GenerateJWKKey(32)
	if (e != nil) {
		return "", e
	}

	result, e := encryptData(data, key)
	if (e != nil) {
		return "", e
	}

	return result, nil
}

// DecryptData decrypts the provided data using the embedded key and IV
func DecryptData(data string) (string, error) {
	finalb64String := reverseString(data)

	finalDataBytes, err := base64.StdEncoding.DecodeString(finalb64String)
	if err != nil {
		return "", err
	}

	var jsonObject JSONData
	if err := json.Unmarshal(finalDataBytes, &jsonObject); err != nil {
		return "", err
	}

	encodedData, err := base64.StdEncoding.DecodeString(jsonObject.Data)
	if err != nil {
		return "", err
	}

	iv := []byte(jsonObject.IV)
	key := jsonObject.Key

	block, err := aes.NewCipher(key.Key.([]byte))
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	decryptedData, err := gcm.Open(nil, iv, encodedData, nil)
	if err != nil {
		return "", err
	}

	return string(decryptedData), nil
}

func generateKey(keySize int) ([]byte, error) {
	key := make([]byte, keySize)
	_, err := io.ReadFull(rand.Reader, key)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func GenerateJWKKey(keySize int) (*jose.JSONWebKey, error) {
	k, e := generateKey(keySize)
	jwk := &jose.JSONWebKey{
		Key:       k,
		KeyID:     "aes-key",
		Algorithm: "A256GCM",
		Use:       "enc",
	}
	return jwk, e
}

// reverseString reverses the input string
func reverseString(s string) string {
	runes := []rune(s)
	for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
		runes[i], runes[j] = runes[j], runes[i]
	}
	return string(runes)
}