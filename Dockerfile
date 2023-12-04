FROM node:20.7.0

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3030

CMD ["npm", "run", "start"]