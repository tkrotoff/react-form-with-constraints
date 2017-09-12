import { Input, ValidityStateFix } from './index';

class InputMock implements Input {
  type = 'input'; // Can be also checkbox;
  validity: ValidityStateFix;

  constructor(public name: string, public value: string, validity: Partial<ValidityStateFix>, public validationMessage: string) {
    const defaultValidity = {
      valid: true,
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valueMissing: false
    };
    if (validationMessage !== '') {
      defaultValidity.customError = true;
    }
    this.validity = {...defaultValidity, ...validity};
  }
}

export default InputMock;
