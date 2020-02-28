import { FieldFeedbackValidation } from './FieldFeedbackValidation';
import { FieldFeedbackType } from './FieldFeedbackType';
import { clearArray } from './clearArray';
import { TextInput, HTMLInput } from './InputElement';

// Field is a better name than Input, see [Django Form fields](https://docs.djangoproject.com/en/1.11/ref/forms/fields/)
export class Field {
  public readonly validations: FieldFeedbackValidation[] = [];

  // Can be useful for the user to get the DOM element
  // See https://github.com/tkrotoff/react-form-with-constraints/issues/41
  //
  // Only available when the field has been validated
  // Populated by FormWithConstraints._validateFields()
  //
  // Cannot be set as readonly :/
  public element?: HTMLInput | TextInput;

  // FIXME See https://github.com/typescript-eslint/typescript-eslint/issues/426
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(public readonly name: string) {}

  addOrReplaceValidation(validation: FieldFeedbackValidation) {
    // See [Update if exists or add new element to array of objects](https://stackoverflow.com/a/49375465/990356)
    const i = this.validations.findIndex(_validation => _validation.key === validation.key);
    if (i > -1) this.validations[i] = validation;
    else this.validations.push(validation);
  }

  clearValidations() {
    clearArray(this.validations);
  }

  hasFeedbacksOfType(type: FieldFeedbackType, fieldFeedbacksKey?: string) {
    return this.validations.some(
      fieldFeedback =>
        (fieldFeedbacksKey === undefined ||
          fieldFeedback.key.startsWith(`${fieldFeedbacksKey}.`)) &&
        fieldFeedback.type === type &&
        fieldFeedback.show === true
    );
  }

  hasErrors(fieldFeedbacksKey?: string) {
    return this.hasFeedbacksOfType(FieldFeedbackType.Error, fieldFeedbacksKey);
  }

  hasWarnings(fieldFeedbacksKey?: string) {
    return this.hasFeedbacksOfType(FieldFeedbackType.Warning, fieldFeedbacksKey);
  }

  hasInfos(fieldFeedbacksKey?: string) {
    return this.hasFeedbacksOfType(FieldFeedbackType.Info, fieldFeedbacksKey);
  }

  hasFeedbacks(fieldFeedbacksKey?: string) {
    return (
      this.hasErrors(fieldFeedbacksKey) ||
      this.hasWarnings(fieldFeedbacksKey) ||
      this.hasInfos(fieldFeedbacksKey)
    );
  }

  isValid() {
    return !this.hasErrors();
  }
}
