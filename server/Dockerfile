FROM node:latest

WORKDIR /server

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . /server

CMD ["npm", "run", "dev"]
