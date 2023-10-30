FROM node:18.17-alpine3.18
WORKDIR /usr/src/app


COPY package*.json /usr/src/app
RUN npm install
COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "run", "dev" ]