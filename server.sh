sudo npx pm2 delete discord

sudo rm -rf ~/discord/cl-discord-bot || true
sudo mkdir -p ~/discord/cl-discord-bot
sudo cp -R ./ ~/discord/cl-discord-bot

sudo npx pm2 start dist/index.js --name discord 
