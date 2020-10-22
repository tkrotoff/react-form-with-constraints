import { notUndefined } from './notUndefined';

test('notUndefined', () => {
  expect([1, null, 2, undefined, 3].filter(value => notUndefined(value))).toEqual([1, null, 2, 3]);
});
