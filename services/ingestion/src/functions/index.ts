import type { AWS } from "@serverless/typescript";


export const functions: AWS["functions"] = {
  hello: {
    handler: "src/functions/handler.main",
    description: "Lambda function to say hello",
    memorySize: 256,
    timeout:900,
    events: [
      {
        schedule:{
          rate:["rate(1 day)"],
          description:'Ingest CSV',
          name:'Ingestionprocess',
          enabled: true
        }
      }
    ],
  },
};
