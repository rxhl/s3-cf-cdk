import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

export class Cdk01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // create a bucket
    const cdk01bucket = new s3.Bucket(this, 'cdk01bucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    });

    // store data to s3
    new s3Deploy.BucketDeployment(this, 'cdk01DeploymentBucket', {
      sources: [s3Deploy.Source.asset('./build')],
      destinationBucket: cdk01bucket,
    });

    // add CF
    new cloudfront.Distribution(this, 'cdk01Dist', {
      defaultBehavior: { origin: new origins.S3Origin(cdk01bucket) },
    });
  }
}
