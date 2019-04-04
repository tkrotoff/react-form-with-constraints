// See [How do I empty an array in JavaScript?](https://stackoverflow.com/q/1232040)
export default function clearArray<T>(array: T[]) {
  while (array.length) {
    array.pop();
  }
}
