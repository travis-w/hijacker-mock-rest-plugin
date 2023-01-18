import { HijackerRequest, HijackerResponse, HttpMethod, Rule, RuleType, Request, Plugin } from "@hijacker/core";

import { routeMatcher } from 'route-matcher';
import { v4 as uuid } from 'uuid';

interface MockRule {
  path: string;
  method: HttpMethod | 'ALL'
  body: any;
  headers?: Record<string, string>;
  statusCode?: number;
}

export class MockRuleType implements RuleType<MockRule> {
  type = 'mock';
  
  createRule(rule: Partial<Rule<MockRule>>) {
    return {
      id: rule.id ?? uuid(),
      disabled: rule.disabled,
      name: rule.name,
      method: rule.method ?? 'ALL',
      type: rule.type ?? 'mock',
      baseUrl: rule.baseUrl ?? '',
      path: rule.path ?? '',
      statusCode: rule.statusCode,
      body: rule.body
    }
  }

  isMatch(request: HijackerRequest, rule: Rule<MockRule>) {
    return !!routeMatcher(rule.path).parse(request.path) && 
      (!Object.prototype.hasOwnProperty.call(rule, 'method') || rule.method === request.method || rule.method === 'ALL');
  }

  async handler(request: Request<MockRule>): Promise<HijackerResponse> {
    const { matchingRule } = request;

    let body = matchingRule.body;

    if (typeof matchingRule.body === 'function') {
      body = matchingRule.body();
    }

    return {
      body,
      headers: matchingRule.headers ?? {},
      statusCode: matchingRule.statusCode ?? 200
    }
  }
}

interface MockPluginOptions {
  name?: string;
}

export class MockRestPlugin implements Plugin {
  name: string;
  ruleTypes: RuleType[];

  constructor(options? : MockPluginOptions) {
    this.name = options?.name ?? 'MockRestPlugin';
    this.ruleTypes = [new MockRuleType()];
  }
}