import * as cdk from 'aws-cdk-lib';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import { Construct } from 'constructs';
//import * as iam from 'aws-cdk-lib/aws-iam';
//import * as sns from 'aws-cdk-lib/aws-sns';
//import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
//import * as sqs from 'aws-cdk-lib/aws-sqs';

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });

    //Access other Amplify resource
    const dependencies: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
      this,
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [
        {
          category: "api",
          resourceName: "crossstackuserapp", 
        },
        {
          category: "function",
          resourceName: "testFunction", 
        },
        {
          category: "function",
          resourceName: "crossstackuserapptestLayer", 
        },
      ]
    );
    
    // Dummy Resource to avoid "At least one Resources member must be defined" error
    // Create a dummy wait resource
    new cdk.CfnResource(this, 'DummyResource', {
      type: 'AWS::CloudFormation::WaitConditionHandle'
    });

    //API Arn
    const apiId = cdk.Fn.ref(
      dependencies.api.crossstackuserapp.GraphQLAPIIdOutput
    );
    const apiArn = cdk.Fn.join(':', [
      'arn:aws:appsync',
      cdk.Aws.REGION,
      cdk.Aws.ACCOUNT_ID,
      cdk.Fn.join('/', ['apis', apiId])
    ]);

    //Lambda Arn
    const lambdaArn = cdk.Fn.ref(
      dependencies.function.testFunction.Arn
    );
    
    //Layer Arn
    const layerArn = cdk.Fn.ref(
      dependencies.function.crossstackuserapptestLayer.Arn
    );

    //CloudFormation export
    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();
    new cdk.CfnOutput(this, 'apiArn', {
      value: apiArn,
      description: 'The ARN of the GraphQL API',
      exportName: `GraphQLAPIArn-${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`
    });
    new cdk.CfnOutput(this, 'lambdaArn', {
      value: lambdaArn,
      description: 'The ARN of the Lambda testFunction',
      exportName: `LambdaArn-${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`
    });
    new cdk.CfnOutput(this, 'layerArn', {
      value: layerArn,
      description: 'The ARN of the Lambda testLayer',
      exportName: `LayerArn-${amplifyProjectInfo.projectName}-${amplifyProjectInfo.envName}`
    });

    /* AWS CDK code goes here - learn more: https://docs.aws.amazon.com/cdk/latest/guide/home.html */
    
    // Example 1: Set up an SQS queue with an SNS topic 

    /*
    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();
    const sqsQueueResourceNamePrefix = `sqs-queue-${amplifyProjectInfo.projectName}`;
    const queue = new sqs.Queue(this, 'sqs-queue', {
      queueName: `${sqsQueueResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    // 👇create sns topic
    
    const snsTopicResourceNamePrefix = `sns-topic-${amplifyProjectInfo.projectName}`;
    const topic = new sns.Topic(this, 'sns-topic', {
      topicName: `${snsTopicResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    // 👇 subscribe queue to topic
    topic.addSubscription(new subs.SqsSubscription(queue));
    new cdk.CfnOutput(this, 'snsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    });
    */

    // Example 2: Adding IAM role to the custom stack 
    /*
    const roleResourceNamePrefix = `CustomRole-${amplifyProjectInfo.projectName}`;
    
    const role = new iam.Role(this, 'CustomRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      roleName: `${roleResourceNamePrefix}-${cdk.Fn.ref('env')}`
    }); 
    */

    // Example 3: Adding policy to the IAM role
    /*
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['*'],
        resources: [topic.topicArn],
      }),
    );
    */

    // Access other Amplify Resources 
    /*
    const retVal:AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this, 
      amplifyResourceProps.category, 
      amplifyResourceProps.resourceName, 
      [
        {category: <insert-amplify-category>, resourceName: <insert-amplify-resourcename>},
      ]
    );
    */
  }
}