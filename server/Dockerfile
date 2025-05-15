FROM node:latest

RUN apt-get update && apt-get install -y sqlite3

WORKDIR /server

COPY package*.json .
COPY tsconfig.json .
COPY src ./src
COPY data ./data
RUN npm install -g ts-node nodemon
RUN npm install --include=dev
