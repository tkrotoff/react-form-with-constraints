import React from 'react';
import { TextInput as _TextInput, TextInputProperties, NativeMethodsMixinStatic, TimerMixin } from 'react-native';

// See [react-native] Wrong type for component ref https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16318#issuecomment-381512846

export interface Props extends TextInputProperties {
  name: string;
}
export declare class TextInputComponent extends React.Component<Props> {}
type Constructor<T> = new(...args: any[]) => T;
export const TextInputBase = _TextInput as any as Constructor<NativeMethodsMixinStatic> & Constructor<TimerMixin> & typeof TextInputComponent;
export class TextInput extends TextInputBase {}
