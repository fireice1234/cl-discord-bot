#!/bin/bash

if [ $1 = stop ]
then
    sudo npx pm2 delete discord
elif [ $1 = start ]
then 
    sudo npx pm2 start dist/index.js --name discord 
elif [ $1 = cp ]
then
    sudo rm -rf ~/discord/cl-discord-bot || true
    sudo mkdir -p ~/discord/cl-discord-bot
    sudo cp -R ./ ~/discord/cl-discord-bot
fi
