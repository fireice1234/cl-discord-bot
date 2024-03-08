#!/bin/bash

if [ $1 = stop ]
then
    screen -S discord -X quit
elif [ $1 = start ]
then 
    screen -S discord
elif [ $1 = cp ]
then
    sudo rm -rf ~/discord/cl-discord-bot || true
    sudo mkdir -p ~/discord/cl-discord-bot
    sudo cp -r ./ ~/discord/cl-discord-bot
fi
