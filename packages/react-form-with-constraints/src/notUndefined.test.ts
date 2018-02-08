import notUndefined from './notUndefined';

test('notUndefined', () => {
  expect([1, null, 2, undefined, 3].filter(notUndefined)).toEqual([1, null, 2, 3]);
});
