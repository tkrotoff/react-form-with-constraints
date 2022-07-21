// [How do I empty an array in JavaScript?](https://stackoverflow.com/q/1232040)
export function clearArray<T>(array: T[]) {
  while (array.length > 0) {
    array.pop();
  }
}
