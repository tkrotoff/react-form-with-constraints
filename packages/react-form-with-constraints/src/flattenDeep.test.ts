import flattenDeep from './flattenDeep';

test('flattenDeep', () => {
  expect(flattenDeep([1, null, 2, undefined, 3, 4])).toEqual([1, null, 2, undefined, 3, 4]);
  expect(flattenDeep([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  expect(flattenDeep([1, [[[2, 3]]], [4]])).toEqual([1, 2, 3, 4]);
  expect(flattenDeep([[[1, [2, 3], 4]]])).toEqual([1, 2, 3, 4]);
});
