// Мінімальні типи для вбудованого тест-раннера Node.js (node:test, node:assert/strict).
// Завдяки цьому тестам не потрібен окремий пакет @types/node.

declare module 'node:test' {
  type TestFn = () => void | Promise<void>;
  export function test(name: string, fn: TestFn): Promise<void>;
  export function describe(name: string, fn: () => void): Promise<void>;
  export function it(name: string, fn: TestFn): Promise<void>;
  export function beforeEach(fn: TestFn): void;
}

declare module 'node:assert/strict' {
  interface StrictAssert {
    (value: unknown, message?: string): asserts value;
    ok(value: unknown, message?: string): asserts value;
    equal<T>(actual: unknown, expected: T, message?: string): asserts actual is T;
    notEqual(actual: unknown, expected: unknown, message?: string): void;
    deepEqual<T>(actual: unknown, expected: T, message?: string): asserts actual is T;
    notDeepEqual(actual: unknown, expected: unknown, message?: string): void;
    match(value: string, pattern: RegExp, message?: string): void;
    doesNotMatch(value: string, pattern: RegExp, message?: string): void;
    throws(fn: () => unknown, message?: string): void;
  }
  const assert: StrictAssert;
  export default assert;
}
