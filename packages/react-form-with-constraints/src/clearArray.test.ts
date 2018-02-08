import clearArray from './clearArray';

test('clearArray', () => {
  const array1 = [1, 2, 3, 4, 5];
  clearArray(array1);
  expect(array1.length).toEqual(0);
  expect(array1[0]).toEqual(undefined);
  expect(array1[4]).toEqual(undefined);

  // Even with undefined or null inside
  const array2 = [1, undefined, 3, null, 5];
  clearArray(array2);
  expect(array2.length).toEqual(0);
  expect(array2[0]).toEqual(undefined);
  expect(array2[4]).toEqual(undefined);
});
