/**
 * Make all properties in T nullable
 *
 * https://github.com/microsoft/TypeScript/blob/v4.0.5/src/lib/es5.d.ts#L1439-L1441
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };
