/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R, T> {
    toHaveTestRenderedChildrenTimes(expected: number): R;
    toHaveTestRenderedClass(expected: string): R;
    toHaveTestRenderedProp(name: string, expected: unknown): R;
    toHaveTestRenderedText(expected: string): R;
  }
}
