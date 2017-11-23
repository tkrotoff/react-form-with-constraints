import { TextInput as _TextInput, TextInputProperties, NativeMethodsMixin, TimerMixin, TextInputState } from 'react-native';

// HACK
// Fix TypeScript error "Property 'name' does not exist on type..." with <TextInput name="username" ... />

// FIXME Definition issues:
// - [react-native] Wrong type for component ref https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16318
// - [react-native] Rename Properties to Props https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21748

export interface TextInputProps extends TextInputProperties {
  name: string;
}

// Redeclare TextInputStatic interface, see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3289762cca59308bf092e4b49ea2242ef27fc23e/types/react-native/index.d.ts#L1268
export interface TextInputStatic extends NativeMethodsMixin, TimerMixin, React.ComponentClass<TextInputProps> {
  State: TextInputState;
  isFocused: () => boolean;
  clear: () => void;
}

export const TextInput = _TextInput as any as TextInputStatic;
export type TextInput = TextInputStatic;
