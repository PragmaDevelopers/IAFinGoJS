with import <nixpkgs> { };
pkgs.mkShell {
  buildInputs = [
    pkgs.go
    pkgs.gcc
    pkgs.libcap
    pkgs.stdenv
    pkgs.glibc
    pkgs.stdenv.cc.cc.lib
    pkgs.zlib
    pkgs.protoc-gen-js
    pkgs.protoc-gen-grpc-web
    pkgs.air
  ];
  shellHook = ''
    export NODE_PATH=~/.npm-packages/lib/node_modules
    export PATH=~/.npm-packages/bin:$PATH
  '';  
}