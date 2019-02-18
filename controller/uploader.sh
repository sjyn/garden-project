#!/usr/bin/env bash

if [[ $# -lt 0 ]];
then
    echo "You must provide a board id"
    exit 132
fi

echo "#define BOARD_ID \"$1\"" > "./src/connector/boards.h"

platformio run --target upload