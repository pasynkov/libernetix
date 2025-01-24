ARG NODE_VERSION="lts"
ARG SUFFIX="-alpine"

FROM node:${NODE_VERSION}${SUFFIX} AS modules
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM modules AS build
COPY . .
RUN npm run build

FROM nginx:1.25.4-alpine as production
COPY --from=build /app/build /usr/share/nginx/html
