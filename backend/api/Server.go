package api

import (
    "context"
    "fmt"
    "log"
    "net"
    "time"

    "google.golang.org/grpc"
    pb "api/proto"

    "utils/crypto"
)

type server struct {
    pb.UnimplementedHelloServiceServer
}

func (s *server) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
    currentTime := time.Now().Unix()
    decData, _ := crypto.DecryptData(req.Username)
    fmt.Printf("Username: %s\n", req.Username)
    fmt.Printf("Decrypted Username: %s\n", decData)
    message := fmt.Sprintf("Hello, %s! Time: %d", decData, currentTime)
    fmt.Printf("MESSAGE: %s\n", message)
    k, e := crypto.GenerateJWKKey(32)
    if (e != nil) {
        panic(e)
    }
    cryptMessage, e := crypto.EncryptData(message, k)
    if (e != nil) {
        panic(e)
    }

    fmt.Printf("ENCRYPTED MESSAGE: %s\n", cryptMessage)

    return &pb.HelloResponse{Message: cryptMessage}, nil
}

func Server() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }

    s := grpc.NewServer()
    pb.RegisterHelloServiceServer(s, &server{})
    log.Printf("server listening at %v", lis.Addr())
    if err := s.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
