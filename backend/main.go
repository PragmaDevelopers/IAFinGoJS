package main

import (
	"fmt"
	"api"
	"utils/crypto"
)

func main() {
	fmt.Println("Running Server!")
	plaintext := "test"
	key, err := crypto.GenerateJWKKey(32)
	if (err != nil) {
		panic(err)
	}


	fmt.Println("plaintext:", plaintext)

	encryptedData, err := crypto.EncryptData(plaintext, key)
	if err != nil {
		fmt.Println("Encryption error:", err)
		return
	}

	fmt.Println("Encrypted Data:", encryptedData)

	decryptedData, err := crypto.DecryptData(encryptedData)
	if err != nil {
		fmt.Println("Decryption error:", err)
		return
	}

	fmt.Println("Decrypted Data:", decryptedData)

	api.Server()
}