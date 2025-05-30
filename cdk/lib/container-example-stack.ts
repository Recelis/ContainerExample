import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";

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
      image: ecs.ContainerImage.fromAsset("../app"),
      portMappings: [{ containerPort: 80 }],
    });

    const frontendFargateService = new ecs.FargateService(
      this,
      "ContainerExampleFrontendService",
      {
        cluster,
        taskDefinition: frontendTask,
        desiredCount: 0,
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

    backendTask.addContainer("ContainerExampleFrontendContainer", {
      image: ecs.ContainerImage.fromAsset("../api"),
      portMappings: [{ containerPort: 8000 }],
    });

    const backendFargateService = new ecs.FargateService(
      this,
      "ContainerExampleBackendService",
      {
        cluster,
        taskDefinition: backendTask,
        desiredCount: 0,
      }
    );

    const starterFunction = new lambda.Function(this, "StarterFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        const AWS = require('aws-sdk');
        const ecs = new AWS.ECS();

        exports.handler = async (event) => {
        const cluster = process.env.CLUSTER_NAME;
        const service = process.env.FRONTEND_FARGATE_SERVICE_NAME;

        // Start the service
        await ecs.updateService({
          cluster,
          service,
          desiredCount: 1,
        }).promise();

        // Wait a few seconds (Fargate takes time to start up)
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10s wait

        // Describe the service to get the task
        const tasksResp = await ecs.listTasks({
          cluster,
          serviceName: service,
          desiredStatus: 'RUNNING',
        }).promise();

        const taskArn = tasksResp.taskArns[0];
        if (!taskArn) {
          return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task is starting up, try again shortly.' }),
          };
        }

        const taskDesc = await ecs.describeTasks({
          cluster,
          tasks: [taskArn],
        }).promise();

        const eniAttachment = taskDesc.tasks[0].attachments.find(att => att.type === 'ElasticNetworkInterface');
        const eniId = eniAttachment.details.find(d => d.name === 'networkInterfaceId').value;

        // Describe the ENI to get the public IP
        const eniDesc = await ec2.describeNetworkInterfaces({
          NetworkInterfaceIds: [eniId],
        }).promise();

        const publicIp = eniDesc.NetworkInterfaces[0].Association.PublicIp;

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Service started', publicIp }),
        };
      };
      `),
      environment: {
        CLUSTER_NAME: cluster.clusterName,
        FRONTEND_FARGATE_SERVICE_NAME: frontendFargateService.serviceName,
        BACKEND_FARGATE_SERVICE_NAME: backendFargateService.serviceName,
      },
    });

    // Give Lambda permission to update ECS service
    starterFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "ecs:UpdateService",
          "ecs:ListTasks",
          "ecs:DescribeTasks",
          "ec2:DescribeNetworkInterfaces",
        ],
        resources: ["*"],
      })
    );

    const api = new apigateway.RestApi(this, "ApiGateway");
    const starterIntegration = new apigateway.LambdaIntegration(
      starterFunction
    );
    api.root.addResource("start-backend").addMethod("POST", starterIntegration);

    new cdk.CfnOutput(this, "ApiUrl", { value: api.url });
  }
}
