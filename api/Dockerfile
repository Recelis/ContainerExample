FROM node:24-alpine AS dev

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