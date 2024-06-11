package api

import (
	"context"
	"fmt"
	"log"
	"net"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"

	pb "api/proto"
	"utils/auth"
	"utils/database"

	"gorm.io/gorm"
)

type Tabler interface {
	TableName() string
  }

type loginCredentials struct {
    gorm.Model
    pb.LogInCredentials
}

type signUpCredentials struct {
    gorm.Model
    pb.SignUpCredentials
}

type login struct {
	pb.UnimplementedLoginServer
}

type signup struct {
	pb.UnimplementedSignupServer
}

func (loginCredentials) TableName() string {
	return "user_credentials"
}

func (signUpCredentials) TableName() string {
	return "user_credentials"
}

func (l *login) Authenticate(ctx context.Context, req *pb.LogInCredentials) (*pb.LogInAuthToken, error) {
	fmt.Println("Login")
    email := req.GetEmail()
	password := req.GetPassword()
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}



	db, err := database.CreateDatabase("database.db", &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	var userLoginCredentials loginCredentials

    db.First(&userLoginCredentials, "email = ?", email)

	emailMatch := email == userLoginCredentials.GetEmail()
	passwordMatch := password == userLoginCredentials.GetPassword()

	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	if emailMatch && passwordMatch {
		fmt.Println("AUTHENTICATED")
		authenticationToken, err := auth.GenerateToken(req.GetEmail(), 24)
		if err != nil {
			return nil, err
		}

		return &pb.LogInAuthToken{Token: authenticationToken}, nil
	}
	return nil, err
}

func (l *signup) Authenticate(ctx context.Context, req *pb.SignUpCredentials) (*pb.SignUpAuthToken, error) {
	fmt.Println("SignUp")
	email := req.GetEmail()
	password := req.GetPassword()
	firstName := req.GetFirstname()
	lastName := req.GetLastname()

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db, err := database.CreateDatabase("database.db", &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	err = db.AutoMigrate(&signUpCredentials{})
	if err != nil {
		return nil, err
	}

	objPK := db.Create(&signUpCredentials{
		SignUpCredentials: pb.SignUpCredentials{
			Email:     email,
			Password:  password,
			Firstname: firstName,
			Lastname:  lastName,
		},
	})

	if objPK != nil {
		authenticationToken, err := auth.GenerateToken(email, 24)
		if err != nil {
			return nil, err
		}

		fmt.Println("AUTHENTICATED")
		return &pb.SignUpAuthToken{Token: authenticationToken}, nil
	}

	return nil, err
}

func Server() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterLoginServer(s, &login{})
	pb.RegisterSignupServer(s, &signup{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
