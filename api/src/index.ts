"use strict";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import "dotenv/config";

import cors from "cors";

const api: Application = express();

api.use(express.json());

api.use(
  cors({
    // TODO: conditionally allow the origins based on the environment
    origin:
      process.env.NODE_ENV === "prod"
        ? ["http://localhost:3000"]
        : ["http://localhost"],
    credentials: true, // if you're using cookies or HTTP auth}))
  })
);

api.get("/", (_req: Request, res: Response) => {
  res.send("Successful response");
});

const port = process.env["PORT"];
const server = () => {
  api.listen(port || 8000, () =>
    console.log(`App is listening on port ${port ?? 8000}.`)
  );
};

server();

export default server;
