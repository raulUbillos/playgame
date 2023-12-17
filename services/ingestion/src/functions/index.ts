import type { AWS } from "@serverless/typescript";


export const functions: AWS["functions"] = {
  hello: {
    handler: "src/functions/handler.main",
    description: "Lambda function to say hello",
    memorySize: 256,
    timeout:900,
    events: [
      {
        http: {
          method: "get",
          path: "ingestion",
          cors: true,
        },
      },
      {
        schedule:{
          rate:["rate(1 minute)"],
          description:'Ingest CSV',
          name:'Ingestion process',
          enabled: true
        }
      }
    ],
  },
};
