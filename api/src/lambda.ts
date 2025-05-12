// lambda.js
import * as serverlessExpress from "@codegenie/serverless-express";
import app from "./index";
exports.handler = serverlessExpress.configure({ app });
