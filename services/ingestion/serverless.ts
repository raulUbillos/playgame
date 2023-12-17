import type { AWS } from "@serverless/typescript";

import { functions } from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "api1",
  frameworkVersion: "3.29.0",
  plugins: ["serverless-esbuild", "serverless-offline"],
  useDotenv: true,
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    stage: "dev",
    region: "eu-central-1",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SCRAPINGWEB: '${env:SCRAPINGWEB}' || '',
      AWS_S3_REGION: '${env:AWS_DEFAULT_REGION}' || '',
      INGEST_BUCKET: '${env:INGEST_BUCKET}' || '',
      MODE: '${env:MODE}' || '',
      AWS_SECRET_ACCESS_KEY:'${env:AWS_SECRET_ACCESS_KEY}' || '',
      AWS_ACCESS_KEY:'${env:AWS_ACCESS_KEY}' || ''
    },
    deploymentMethod: 'direct',
    architecture: 'arm64'
  },
  functions,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node18",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
