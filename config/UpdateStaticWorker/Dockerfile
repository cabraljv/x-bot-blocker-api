FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .


CMD ["node", "src/workers/updateStatic.js"]
