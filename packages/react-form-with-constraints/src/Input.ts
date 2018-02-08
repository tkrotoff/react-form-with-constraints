export default interface Input {
  readonly name: string;
  readonly type: string; // Not needed internally
  readonly value: string;
  readonly validity: ValidityState;
  readonly validationMessage: string;
}
