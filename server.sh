#!/bin/bash

if [ $1 = stop ]
then
    cd
    sudo npx pm2 delete discord
elif [ $1 = start ]
then 
    cd ~/discord/cl-discord-bot
    sudo npx pm2 start dist/index.js --name discord 
elif [ $1 = cp ]
then
    sudo rm -rf ~/discord/cl-discord-bot || true
    sudo mkdir -p ~/discord/cl-discord-bot
    sudo cp -r ./ ~/discord/cl-discord-bot
fi
