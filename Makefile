# Dev commands
dev-build:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

dev-up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

dev-down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-prisma-migrate:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm api npx prisma migrate dev

dev-prisma-reset:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml run --rm api npx prisma migrate reset

# Prod commands
prod-build:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
