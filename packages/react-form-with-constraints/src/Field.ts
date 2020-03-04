import FieldFeedbackValidation from './FieldFeedbackValidation';
import FieldFeedbackType from './FieldFeedbackType';
import clearArray from './clearArray';

// Field is a better name than Input, see Django Form fields https://docs.djangoproject.com/en/1.11/ref/forms/fields/
export default class Field {
  public readonly validations: FieldFeedbackValidation[] = [];

  constructor(public readonly name: string) {}

  addOrReplaceValidation(validation: FieldFeedbackValidation) {
    // See Update if exists or add new element to array of objects https://stackoverflow.com/a/49375465/990356
    const i = this.validations.findIndex(_validation => _validation.id === validation.id);
    if (i > -1) this.validations[i] = validation;
    else this.validations.push(validation);
  }

  clearValidations() {
    clearArray(this.validations);
  }

  hasFeedbacksOfType(type: FieldFeedbackType, fieldFeedbacksId?: string) {
    return this.validations.some(fieldFeedback =>
      (fieldFeedbacksId === undefined || fieldFeedback.id.startsWith(`${fieldFeedbacksId}.`)) &&
      fieldFeedback.type === type && fieldFeedback.show === true
    );
  }

  hasErrors(fieldFeedbacksId?: string) {
    return this.hasFeedbacksOfType(FieldFeedbackType.Error, fieldFeedbacksId);
  }

  hasWarnings(fieldFeedbacksId?: string) {
    return this.hasFeedbacksOfType(FieldFeedbackType.Warning, fieldFeedbacksId);
  }

  hasInfos(fieldFeedbacksId?: string) {
    return this.hasFeedbacksOfType(FieldFeedbackType.Info, fieldFeedbacksId);
  }

  hasFeedbacks(fieldFeedbacksId?: string) {
    return this.hasErrors(fieldFeedbacksId) ||
           this.hasWarnings(fieldFeedbacksId) ||
           this.hasInfos(fieldFeedbacksId);
  }

  isValid() {
    return !this.hasErrors();
  }
}
