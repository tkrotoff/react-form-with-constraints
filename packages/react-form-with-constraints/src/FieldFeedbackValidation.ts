export default interface FieldFeedbackValidation {
  key: number;
  isValid: boolean | undefined; // undefined means the FieldFeedback was not checked
}
