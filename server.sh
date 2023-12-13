#!/bin/sh
rm -rf node_modules

rm -rf dist

git pull

npm run install

npm run build

npm run start