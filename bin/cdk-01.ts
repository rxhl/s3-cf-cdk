#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Cdk01Stack } from '../lib/cdk-01-stack';

const app = new cdk.App();
new Cdk01Stack(app, 'Cdk01Stack');
