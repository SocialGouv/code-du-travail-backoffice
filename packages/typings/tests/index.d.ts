/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R, T> {
    toHaveTestRenderedClass(className: string): R;
    toHaveTestRenderedProp(propName: string, propValue: unknown): R;
  }
}
