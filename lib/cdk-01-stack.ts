import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as wafv2 from '@aws-cdk/aws-wafv2';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';

/**
 * Utility class for WebAcl
 */
class WebAclEx extends wafv2.CfnWebACL {
  constructor(host: any, id: string, props: wafv2.CfnWebACLProps) {
    super(host, id, props);
  }
}

/**
 * Primary stack creation class
 */
export class Cdk01Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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

    // create ACL
    const webAcl = new WebAclEx(this, 'WebAcl', {
      defaultAction: { allow: {} },
      rules: [
        {
          name: 'AWS-AWSManagedRulesAmazonIpReputationList',
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesAmazonIpReputationList',
            },
          },
          overrideAction: {
            none: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'Staging-AWS-AWSManagedRulesAmazonIpReputationList',
          },
        },
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 1,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            },
          },
          overrideAction: {
            none: {},
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'Staging-AWS-AWSManagedRulesCommonRuleSet',
          },
        },
      ],
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'web-hosting',
      },
    });

    // add CF
    new cloudfront.Distribution(this, 'cdk01Dist', {
      defaultBehavior: { origin: new origins.S3Origin(cdk01bucket) },
      webAclId: webAcl.attrArn,
    });
  }
}
