FROM node:latest

WORKDIR /server

COPY package.json .
COPY package-lock.json .

RUN npm install
RUN npm install -g nodemon

COPY . /server

CMD ["npm", "run", "dev"]
