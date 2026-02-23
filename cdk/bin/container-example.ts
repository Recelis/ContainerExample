#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ContainerExampleStack } from "../lib/container-example-stack";

const app = new cdk.App();
new ContainerExampleStack(app, "ContainerExampleStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
