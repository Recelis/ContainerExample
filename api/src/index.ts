"use strict";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import "dotenv/config";

const api: Application = express();

api.get("/", (_req: Request, res: Response) => {
  res.send("Successful response.");
});

export default api;
