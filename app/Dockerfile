FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install -g expo
RUN npm install

COPY app ./app
COPY assets ./assets
COPY tsconfig.json .
COPY app.json .
COPY package*.json .
