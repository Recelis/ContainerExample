FROM node:24-alpine AS dev

WORKDIR /api
COPY ./package.json .

RUN yarn install

COPY . .

CMD ["yarn", "dev"]


FROM dev AS build
RUN yarn run build

FROM build AS prod

CMD ["yarn", "start"]