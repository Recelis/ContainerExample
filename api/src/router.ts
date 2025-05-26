import { Express, NextFunction, Request, Response } from "express";
import { signin } from "./routes/auth";

import { authenticateToken } from "./middleware/authenticateToken";
import { PrismaClient } from "@prisma/client";

export const router = (api: Express, prisma: PrismaClient): Express => {
  api.get("/", (_req: Request, res: Response) => {
    res.send("Successful response");
  });

  api.post("/auth/signin", (req: Request, res: Response, _next: NextFunction) =>
    signin(req, res, _next, prisma)
  );

  return api;
};
