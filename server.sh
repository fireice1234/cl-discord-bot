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
    echo rm
    sudo rm -rf ~/discord/cl-discord-bot || true
    echo rmend
    ls
    echo mkdir
    sudo mkdir -p ~/discord/cl-discord-bot
    ls
    cd cl-discord-bot
    echo cd
    ls
    echo ee
    sudo cp -r ~/actions-runner/_work/cl-discord-bot/cl-discord-bot ~/discord/cl-discord-bot
    ls
    echo eee
    sudo cp -f ~/discord/.env ~/discord/cl-discord-bot/.env
fi
