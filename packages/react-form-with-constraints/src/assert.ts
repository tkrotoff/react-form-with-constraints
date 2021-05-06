// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/#assertion-functions
export function assert(condition: boolean, message?: string): asserts condition {
  // error TS2569: Type 'IArguments' is not an array type or a string type.
  // Use compiler option '--downlevelIteration' to allow iterating of iterators.
  //console.assert(...arguments);

  if (message === undefined) {
    console.assert(condition);
  } else {
    console.assert(condition, message);
  }
}
