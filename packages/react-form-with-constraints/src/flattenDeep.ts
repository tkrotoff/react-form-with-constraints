// Flatten nested arrays using recursion in JavaScript https://stackoverflow.com/q/30582352
// See Merge/flatten an array of arrays in JavaScript? https://stackoverflow.com/q/10865025
// See Lodash _.flattenDeep(array) https://lodash.com/docs/4.17.5#flattenDeep
// See Array.prototype.flatten() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatten

export interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

const flattenDeep = <T>(arrayOfArrays: RecursiveArray<T>): T[] => {
  return arrayOfArrays
    .reduce<T[]>(
      (prev, curr) => prev.concat(Array.isArray(curr) ? flattenDeep(curr) : curr),
      []
    );
};

export default flattenDeep;
