// Field is a better name than Input, see Django Form fields https://docs.djangoproject.com/en/1.11/ref/forms/fields/
export interface Field {
  dirty: boolean;

  // List of FieldFeedback keys to display
  errors: Set<number>;
  warnings: Set<number>;
  infos: Set<number>;

  // Copy of input.validationMessage
  // See https://developer.mozilla.org/en/docs/Web/API/HTMLInputElement
  // See https://www.w3.org/TR/html51/sec-forms.html#the-constraint-validation-api
  validationMessage: string;
}

export interface Fields {
  // Could be also Map<string, Field>
  [fieldName: string]: Field | undefined;
}
