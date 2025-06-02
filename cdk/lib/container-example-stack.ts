import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as aws_ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import { Platform } from "aws-cdk-lib/aws-ecr-assets";

import path = require("path");

export class ContainerExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stackName = cdk.Stack.of(this).stackName;

    const vpc = new ec2.Vpc(this, "ContainerExampleVpc", {
      maxAzs: 2, // Fargate requires at least 2 AZs
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "public-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const cluster = new ecs.Cluster(this, "ContainerExampleCluster", {
      vpc,
    });

    const frontendTask = new ecs.FargateTaskDefinition(
      this,
      "ContainerExampleFrontendServiceTask",
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    frontendTask.addContainer("ContainerExampleFrontendContainer", {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, "../../app"), {
        file: "Dockerfile",
        target: "prod",
        buildArgs: {
          NODE_ENV: "production",
        },
        platform: Platform.LINUX_AMD64,
      }),
      portMappings: [{ containerPort: 80 }],
    });

    const frontendFargateService =
      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "ContainerExampleFrontendService",
        {
          cluster,
          taskDefinition: frontendTask,
          desiredCount: 1,
          assignPublicIp: true,
        }
      );

    const backendTask = new ecs.FargateTaskDefinition(
      this,
      "ContainerExampleBackendServiceTask",
      {
        cpu: 256,
        memoryLimitMiB: 512,
      }
    );

    backendTask.addContainer("ContainerExampleBackendContainer", {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, "../../api"), {
        file: "Dockerfile",
        target: "prod",
        buildArgs: {
          NODE_ENV: "production",
        },
        platform: Platform.LINUX_AMD64,
      }),
      portMappings: [{ containerPort: 8000 }],
    });

    const backendFargateService =
      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "ContainerExampleBackendService",
        {
          cluster,
          taskDefinition: backendTask,
          desiredCount: 1,
          assignPublicIp: true,
        }
      );

    new cdk.CfnOutput(this, "AppUrl", {
      value: frontendFargateService.loadBalancer.loadBalancerDnsName,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: backendFargateService.loadBalancer.loadBalancerDnsName,
    });
  }
}
