#!/bin/bash

if [[ ! -d certs ]]
then
    mkdir certs
    cd certs/
    if [[ ! -f localhost.pfx ]]
    then
        dotnet dev-certs https -v -ep localhost.pfx -p 8f9021c5-091c-4cde-96af-32588be6b6c2 -t
    fi
    cd ../
fi

docker-compose up -d
