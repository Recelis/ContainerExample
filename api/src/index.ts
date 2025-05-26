"use strict";
import "dotenv/config";

import { apiRouter } from "./api";

const port = process.env["PORT"];
const server = () => {
  apiRouter.listen(port || 8000, () =>
    console.log(`App is listening on port ${port ?? 8000}.`)
  );
};

server();
