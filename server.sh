#!/bin/bash

if [ $1 = stop ]
then
    killall -9 node || true
elif [ $1 = start ]
then 
    sudo nohup npm run start </dev/null >/dev/null 2>&1 &
elif [ $1 = cp ]
then
    sudo rm -rf ~/discord/cl-discord-bot || true
    sudo mkdir -p ~/discord/cl-discord-bot
    cd ~/actions-runner/_work/
    ls
    cd ~/actions-runner/_work/cl-discord-bot
    ls
    sudo cp -r ~/actions-runner/_work/cl-discord-bot/cl-discord-bot ~/discord/cl-discord-bot
    sudo cp -f ~/discord/.env ~/discord/cl-discord-bot/.env
fi
