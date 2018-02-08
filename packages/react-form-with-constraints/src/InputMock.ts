import { Input } from './index';

export class InputMock implements Input {
  readonly type = 'input'; // Can also be checkbox;
  readonly validity: ValidityState;

  constructor(
    public readonly name: string,
    public readonly value: string,
    validity: Partial<ValidityState>,
    public readonly validationMessage: string
  ) {
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

export const input_username_valueMissing = new InputMock('username', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
export const input_username_valid = new InputMock('username', 'jimmy', {valid: true}, '');
export const input_username_error_valid = new InputMock('username', 'error', {valid: true}, '');
export const input_unknown_valueMissing = new InputMock('unknown', '', {valid: false, valueMissing: true}, 'Suffering from being missing');
