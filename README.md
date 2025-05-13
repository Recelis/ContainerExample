# AWS Container Example

Backend:
A Typescript node web server.

Frontend:
React

This public template will be for a simple text summarizer error checker for a Github repo.

The main point of this template is to setup these in terms of Docker containers and spin up an AWS ECS with AWS Fargate. It isn't very intelligent so it will check through the entire codebase each time instead of viewing the diffs.

## Plan

1. [x] - Dockerise a React app
2. [x] - Dockerise the Node App
3. [x] - Dockerise a Postgres db
4. [ ] - Integrate with Better Auth
5. [ ] - Multistage builds for dev and prod
6. [ ] - Setup CDK ECS and Fargate
7. [ ] - Connect to Aurora Serverless v2
