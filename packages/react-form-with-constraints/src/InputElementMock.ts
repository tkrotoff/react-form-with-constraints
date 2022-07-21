import { InputElement, IValidityState } from './InputElement';

export const validValidityState: IValidityState = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: true,
  valueMissing: false
};

export class InputElementMock implements InputElement {
  readonly type = 'input'; // Can also be checkbox
  readonly validity: IValidityState;

  constructor(
    public readonly name: string,
    public readonly value: string,
    validity: Partial<IValidityState>,
    public readonly validationMessage: string
  ) {
    const defaultValidity = { ...validValidityState };
    if (validationMessage !== '') defaultValidity.customError = true;
    this.validity = { ...defaultValidity, ...validity };
  }
}

export const input_username_valueMissing = new InputElementMock(
  'username',
  '',
  { valid: false, valueMissing: true },
  'Suffering from being missing'
);
export const input_username_valid = new InputElementMock('username', 'jimmy', { valid: true }, '');
export const input_username_error_valid = new InputElementMock(
  'username',
  'error',
  { valid: true },
  ''
);
export const input_unknown_valueMissing = new InputElementMock(
  'unknown',
  '',
  { valid: false, valueMissing: true },
  'Suffering from being missing'
);
