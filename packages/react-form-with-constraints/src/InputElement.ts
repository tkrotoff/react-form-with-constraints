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

  // validity and validationMessage available for (lib.dom.d.ts):
  // HTMLButtonElement, HTMLFieldSetElement, HTMLInputElement, HTMLObjectElement,
  // HTMLOutputElement, HTMLSelectElement, HTMLTextAreaElement
  // ValidityState is supported by IE >= 10
  readonly validity: IValidityState;
  readonly validationMessage: string;

  // Need to duplicate the input when the user changes rapidly the input
  // otherwise we will treat only the last input value instead of every input value change
  constructor(input: /*HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement*/ InputElement | TextInput) {
    if ((input as any).props === undefined) {
      input = input as InputElement;
      this.name = input.name;
      this.type = input.type;
      this.value = input.value;

      // Solution 1: no clone, then .mock.calls never ends with ValidityState inside FormWithConstraints.test.tsx in v0.8
      //this.validity = input.validity;

      // Solution 2: JSON does not work to clone ValidityState (results in an empty object)
      //this.validity = JSON.parse(JSON.stringify(input.validity));

      // Solution 3: manually clone ValidityState
      this.validity = new IValidityState(input.validity as ValidityState);

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

// Cannot clone ValidityState using JSON.parse(JSON.stringify(input.validity)),
// results in an empty object ({}) under Chrome 66, Firefox 60 and Safari 10.1.2
// so let's manually clone it.
export class IValidityState implements ValidityState {
  readonly badInput: boolean;
  readonly customError: boolean;
  readonly patternMismatch: boolean;
  readonly rangeOverflow: boolean;
  readonly rangeUnderflow: boolean;
  readonly stepMismatch: boolean;
  readonly tooLong: boolean;
  readonly tooShort: boolean;
  readonly typeMismatch: boolean;
  readonly valid: boolean;
  readonly valueMissing: boolean;

  constructor(validity: ValidityState) {
    this.badInput = validity.badInput;
    this.customError = validity.customError;
    this.patternMismatch = validity.patternMismatch;
    this.rangeOverflow = validity.rangeOverflow;
    this.rangeUnderflow = validity.rangeUnderflow;
    this.stepMismatch = validity.stepMismatch;
    this.tooLong = validity.tooLong;
    this.tooShort = validity.tooShort;
    this.typeMismatch = validity.typeMismatch;
    this.valid = validity.valid;
    this.valueMissing = validity.valueMissing;
  }
}
