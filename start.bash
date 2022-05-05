#!/bin/bash

pids=( )

cleanup() {
    for pid in "${pids[@]}"; do
        kill -0 "$pid" && kill "$pid"
    done
}

trap cleanup EXIT TERM

yarn start:phidgets-server & pids+=( "$!" )
yarn start:api & pids+=( "$!" )
yarn start:app & pids+=( "$!" )

wait
