// [TypeScript 2.2 Support for Mix-in classes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html)
export type Constructor<T> = new (...args: any[]) => T;
