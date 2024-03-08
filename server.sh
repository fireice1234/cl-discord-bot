if [ $1 -eq stop ]
then
    sudo npx pm2 delete discord
elif [ $1 -eq start ]
then 
    sudo npx pm2 start dist/index.js --name discord 
elif [ $1 -eq cp ]
then
    sudo rm -rf ~/discord/cl-discord-bot || true
    sudo mkdir -p ~/discord/cl-discord-bot
    sudo cp -R ./ ~/discord/cl-discord-bot
fi
