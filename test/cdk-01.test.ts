import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Cdk01 from '../lib/cdk-01-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cdk01.Cdk01Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
