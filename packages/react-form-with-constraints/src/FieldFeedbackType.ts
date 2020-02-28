// Not inside FieldFeedback to avoid a circular dependency:
// Async.js -> FormWithConstraints.js -> FieldsStore.js -> Field.js -> FieldFeedback.js -> Async.js
// Field.js -> FieldFeedback.js -> FormWithConstraints.js -> FieldsStore.js -> Field.js
// FieldFeedback.js -> FormWithConstraints.js -> FieldsStore.js -> Field.js -> FieldFeedback.js
// FieldFeedbackWhenValid.js -> FormWithConstraints.js -> FieldsStore.js -> Field.js -> FieldFeedback.js -> FieldFeedbackWhenValid.js
// FieldFeedbacks.js -> FormWithConstraints.js -> FieldsStore.js -> Field.js -> FieldFeedback.js -> FieldFeedbacks.js
// FieldsStore.js -> Field.js -> FieldFeedback.js -> FormWithConstraints.js -> FieldsStore.js
// FormWithConstraints.js -> FieldsStore.js -> Field.js -> FieldFeedback.js -> FormWithConstraints.js
//
// Detected thanks to https://github.com/aackerman/circular-dependency-plugin
//
// This caused an error with PropTypes:
// `Warning: Failed context type: Right-hand side of 'instanceof' is not an object`
// with `form: PropTypes.instanceOf(FormWithConstraints).isRequired` inside FieldFeedbacks
export enum FieldFeedbackType {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  WhenValid = 'whenValid'
}
