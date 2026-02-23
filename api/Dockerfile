FROM node:20-alpine AS dev

RUN apk add --no-cache openssl

WORKDIR /api
COPY ./package.json .

RUN yarn install

COPY . .

# Prisma must be generated before it can be used.
RUN  npx prisma generate

CMD ["yarn", "dev"]


FROM dev AS build
RUN yarn run build

FROM build AS prod

CMD ["yarn", "start"]