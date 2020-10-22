import * as React from 'react';
import { TextInput as TextInputNative, TextInputProps } from 'react-native';

export interface Props extends TextInputProps {
  name: string;
}

// Class component: https://reactnative.dev/docs/0.59/textinput
// Function component: https://reactnative.dev/docs/0.60/textinput
//
// Cannot use function component otherwise TypeScript complains in Native.tsx on TextInput[]:
// "'TextInput' refers to a value, but is being used as a type here. Did you mean 'typeof TextInput'?"

// export function TextInput(props: Props) {
//   return <TextInputNative {...props} />;
// }

export class TextInput extends React.PureComponent<Props> {
  render() {
    return <TextInputNative {...this.props} />;
  }
}
