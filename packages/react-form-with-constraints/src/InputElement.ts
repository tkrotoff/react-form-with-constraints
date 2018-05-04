// See React Native TextInput https://facebook.github.io/react-native/docs/textinput.html
// Here so we don't have to "import { TextInput } from 'react-native'" and depend on React Native
export interface TextInput {
  //value?: string; // Always undefined, use instead props.value
  props: {
    name: string;
    value?: string;
  };
}

export class InputElement {
  readonly name: string;
  readonly type: string; // Not needed internally, can be text, radio...
  readonly value: string;
  readonly validity: ValidityState;
  readonly validationMessage: string;

  // Need to duplicate the input when the user changes rapidly the input
  // otherwise we will treat only the last input value instead of every input value change
  constructor(input: /*HTMLInputElement*/ InputElement | TextInput) {
    if ((input as any).props === undefined) {
      input = input as InputElement;
      this.name = input.name;
      this.type = input.type;
      this.value = input.value;
      this.validity = input.validity;
      this.validationMessage = input.validationMessage;
    } else {
      input = input as TextInput;
      this.name = input.props!.name;
      this.type = undefined as any;
      this.value = input.props!.value!; // Tested: TextInput props.value is always a string and never undefined (empty string instead)
      this.validity = undefined as any;
      this.validationMessage = undefined as any;
    }
  }
}
