export type AmplifyDependentResourcesAttributes = {
  "api": {
    "crossstackuserapp": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "custom": {
    "customExport": {
      "apiArn": "string"
    }
  },
  "function": {
    "crossstackuserapptestLayer": {
      "Arn": "string"
    },
    "testFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}