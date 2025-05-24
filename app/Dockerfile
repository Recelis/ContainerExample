# =========================
# Development Stage
# =========================
FROM node:24-alpine AS dev

WORKDIR /app


# Install deps first for better caching
COPY package*.json ./
RUN yarn install

# Copy rest of app (in dev, you’ll override this with a bind mount)
COPY . .

RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["yarn", "dev"]

# =========================
# Build Stage (for Production)
# =========================
FROM dev AS build
RUN yarn build

# =========================
# Production Nginx Stage
# =========================
FROM nginx:alpine AS prod

WORKDIR /usr/share/nginx/html

# Copy built React files into Nginx folder
COPY --from=build /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
