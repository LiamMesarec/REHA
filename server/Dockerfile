FROM node:latest

WORKDIR /server

COPY package*.json .
COPY tsconfig.json .
COPY src ./src

RUN npm install -g ts-node nodemon
RUN npm install --include=dev