#!/bin/sh
rm -rf node_modules

rm -rf dist

npm install

npm run build

npx prisma generate

pm2 start dist/index.js