ARG ENV=prod

FROM node:18-alpine

WORKDIR /api
COPY ./api/package*.json ./

RUN yarn install

COPY ./api ./

RUN yarn run build

CMD ["yarn", "start"]