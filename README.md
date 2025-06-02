# AWS Container Example

Backend:
A Typescript node web server.
Database uses Postgres with Prisma as an ORM.

Frontend:
React

This public template will be for a simple text summarizer error checker for a Github repo.

The main point of this template is to setup these in terms of Docker containers and spin up an AWS ECS with AWS Fargate. It isn't very intelligent so it will check through the entire codebase each time instead of viewing the diffs.

See the `Makefile` for commands on running, building and stopping the containers.

## Seeding

When running in development, a seed script is run. You can call `make dev-prisma-seed` to add Bobby Hasd as a user to your dev Postgres and then call `make psql` to check that the user has been added.

```SQL
SELECT * FROM "Profile"; -- Profile needs to start with a capital letter with Double Quotation marks. Also remember to end with a semicolon;
```

## Plan

1. [x] - Dockerise a React app
2. [x] - Dockerise the Node App
3. [x] - Dockerise a Postgres db
4. [x] - Integrate with Prisma
5. [x] - Seeding with dummy user Bob Hasd
6. [x] - Setup simple authentication
7. [x] - Multistage builds for dev and prod
8. [x] - Setup CDK ECS and Fargate
9. [ ] - Connect to Aurora Serverless v2
10. [ ] - Run seed script in Aurora on deploy/initialise
