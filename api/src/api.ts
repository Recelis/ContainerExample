import cors from "cors";
import { router } from "./router";
import { PrismaClient } from "@prisma/client";
import express, { type Express } from "express";

const api: Express = express();

api.use(express.json());
api.use(
  cors({
    // TODO: conditionally allow the origins based on the environment
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:3000"]
        : ["http://localhost"],
    credentials: true, // if you're using cookies or HTTP auth}))
  })
);

const prisma = new PrismaClient();

export const apiRouter = router(api, prisma);

export const prismaClient = prisma;
