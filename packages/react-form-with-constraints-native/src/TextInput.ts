import React from 'react';
import { TextInput as _TextInput, TextInputProps } from 'react-native';

import { Constructor } from 'react-form-with-constraints';

// See [react-native] Wrong type for component ref https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16318#issuecomment-381512846

export interface Props extends TextInputProps {
  name: string;
}
export declare class TextInputComponent extends React.Component<Props> {}
export const TextInputBase = _TextInput as any as Constructor<_TextInput> & typeof TextInputComponent;
export class TextInput extends TextInputBase {}
