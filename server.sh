#!/bin/sh
cd /mnt/ssd/cl-discord-bot

rm -rf node_modules

rm -rf dist

git pull

npm install

npm install typescript

npm run build

npx prisma generate

pm2 start dist/index.js