#!/bin/sh
cd /mnt/ssd/cl-discord-bot

rm -rf node_modules

rm -rf dist

git pull

npm run install

npm run build

npm run start