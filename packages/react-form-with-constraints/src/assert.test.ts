import { assert } from './assert';

test('TypeScript "asserts condition"', () => {
  const foobar = (): number | string => 'foobar';

  const str = foobar();
  assert(typeof str === 'string');

  // Without assert(), TypeScript error: "Property 'includes' does not exist on type 'number'"
  str.includes('foo');
});

test('console output', () => {
  expect.assertions(4);

  const consoleSpy = jest.spyOn(console, 'assert').mockImplementation();

  assert(false);

  // "Unreachable code detected" for TypeScript

  expect(consoleSpy).toHaveBeenCalledTimes(1);
  // Tests that it's not "false, undefined"
  expect(consoleSpy).toHaveBeenCalledWith(false);

  assert(false, 'a message');
  expect(consoleSpy).toHaveBeenCalledTimes(2);
  expect(consoleSpy).toHaveBeenCalledWith(false, 'a message');

  consoleSpy.mockRestore();
});
