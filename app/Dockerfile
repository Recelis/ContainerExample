ARG ENV=prod

FROM node:18-alpine

WORKDIR /app
COPY ./app/package*.json ./

RUN yarn

COPY ./app ./

CMD ["yarn", "dev"]