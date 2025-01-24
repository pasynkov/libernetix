ARG NODE_VERSION="lts"
ARG SUFFIX="-alpine"

FROM node:${NODE_VERSION}${SUFFIX} AS modules
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM modules AS build
COPY . .
RUN npm run build

FROM modules AS production
COPY --from=build /app/dist .
CMD ["node", "main.js"]
