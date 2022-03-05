FROM node:16 as build-stage

WORKDIR /incident-service-app
COPY package.json .
RUN npm install
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# Stage 2
FROM nginx:1.17.0-alpine

COPY --from=build-stage incident-service-app/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT
CMD nginx -g 'daemon off;'
