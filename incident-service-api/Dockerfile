FROM node:16

WORKDIR /incident-service-api
COPY package.json .
RUN npm install
COPY . .
CMD npm start