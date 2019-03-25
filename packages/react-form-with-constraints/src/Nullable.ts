/**
 * Make all properties in T nullable
 */
type Nullable<T> = { [P in keyof T]: T[P] | null };

// eslint-disable-next-line no-undef
export default Nullable;
