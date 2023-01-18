import { defineConfig } from '@hijacker/core';
import { v4 as uuid } from 'uuid';

import { MockRestPlugin } from './MockRulePlugin';

export default defineConfig({
  port: 3000,
  baseRule: {
    baseUrl: 'http://localhost:3000',
    type: 'mock',
    statusCode: 400,
    body: {
      error: 'No rule set up for this route'
    }
  },
  rules: [
    {
      path: '/hello/world',
      body: () => ({
        randomUuid: uuid()
      })
    }
  ],
  plugins: [
    new MockRestPlugin()
  ]
});