package database

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func CreateDatabase(fileName string, opts ...gorm.Option) (*gorm.DB, error) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	_dbPath := os.Getenv("DATABASE_PATH")
	cwd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	databasePath := filepath.Join(cwd, _dbPath, fileName)

	db, err := gorm.Open(sqlite.Open(databasePath), opts...)
	return db, err
}