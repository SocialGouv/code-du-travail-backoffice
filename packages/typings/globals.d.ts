/// <reference types="jest" />

import { StyleRuleOptions } from "jest-emotion";

declare global {
  declare namespace jest {
    interface Matchers<R, T> {
      toHaveTestRenderedChild(testId: string): R;
      toHaveTestRenderedChildLength(expected: number, testId?: string): R;
      toHaveTestRenderedClassName(expected: string, testId?: string): R;
      toHaveTestRenderedProperty(propertyName: string, expected: unknown, testId?: string): R;
      toHaveTestRenderedStyleRule(
        propertyName: string,
        expected: string | number,
        options: StyleRuleOptions,
        testId?: string,
      ): R;
      toHaveTestRenderedType(expected: string, testId?: string): R;
      toHaveTestRenderedTextContent(expected: string, testId?: string): R;
    }
  }
}
