#!/bin/bash

if [ $1 = stop ]
then
    killall -9 node || true
elif [ $1 = start ]
then 
    sudo nohup npm run start </dev/null >/dev/null 2>&1 &
elif [ $1 = cp ]
then
    cd ~/discord
    ls
    sudo rm -rf ~/discord/cl-discord-bot || true
    ls
    sudo mkdir -p ~/discord/cl-discord-bot
    cd cl-discord-bot
    ls
    sudo cp -r ./ ~/discord/cl-discord-bot
    ls
    sudo cp -f ~/discord/.env ~/discord/cl-discord-bot/.env
fi
