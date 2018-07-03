import React from 'react';
import PropTypes from 'prop-types';

import { withValidateFieldEventEmitter } from './withValidateFieldEventEmitter';
import { withFieldWillValidateEventEmitter } from './withFieldWillValidateEventEmitter';
import { withFieldDidValidateEventEmitter } from './withFieldDidValidateEventEmitter';
import { withResetEventEmitter } from './withResetEventEmitter';
import Field from './Field';
import { InputElement } from './InputElement';
import { FieldsStore } from './FieldsStore';
import FieldFeedbackValidation from './FieldFeedbackValidation';
import flattenDeep from './flattenDeep';
import notUndefined from './notUndefined';

export interface FormWithConstraintsChildContext {
  form: FormWithConstraints;
}

export interface FormWithConstraintsProps extends React.FormHTMLAttributes<HTMLFormElement> {
}

export class FormWithConstraintsComponent extends React.Component<FormWithConstraintsProps> {}
export class FormWithConstraints
  extends
    withResetEventEmitter(
      withFieldWillValidateEventEmitter(
        withFieldDidValidateEventEmitter(
          withValidateFieldEventEmitter<
            // FieldFeedback returns FieldFeedbackValidation
            // Async returns FieldFeedbackValidation[] | undefined
            // FieldFeedbacks returns (FieldFeedbackValidation | undefined)[] | undefined
            FieldFeedbackValidation | (FieldFeedbackValidation | undefined)[] | undefined,
            typeof FormWithConstraintsComponent
          >(
            FormWithConstraintsComponent
          )
        )
      )
    )
  implements React.ChildContextProvider<FormWithConstraintsChildContext> {

  static childContextTypes: React.ValidationMap<FormWithConstraintsChildContext> = {
    form: PropTypes.object.isRequired
  };
  getChildContext(): FormWithConstraintsChildContext {
    return {
      form: this
    };
  }

  // Could be named innerRef instead, see https://github.com/ant-design/ant-design/issues/5489#issuecomment-332208652
  private form: HTMLFormElement | null = null;

  fieldsStore = new FieldsStore();

  private fieldFeedbacksKeyCounter = 0;
  computeFieldFeedbacksKey() {
    return `${this.fieldFeedbacksKeyCounter++}`;
  }

  /**
   * Validates the given fields, either HTMLInputElements or field names.
   * If called without arguments, validates all fields ($('[name]')).
   */
  validateFields(...inputsOrNames: Array<InputElement | string>) {
    return this._validateFields(/* forceValidateFields */ true, ...inputsOrNames);
  }

  // Validates only what's necessary (e.g. non-checked fields)
  validateForm() {
    return this._validateFields(/* forceValidateFields */ false);
  }

  private async _validateFields(forceValidateFields: boolean, ...inputsOrNames: Array<InputElement | string>) {
    const fields = new Array<Readonly<Field>>();

    const inputs = this.normalizeInputs(...inputsOrNames);

    for (const input of inputs) {
      const field = await this.validateField(forceValidateFields, new InputElement(input));
      if (field !== undefined) fields.push(field);
    }

    return fields;
  }

  private async validateField(forceValidateFields: boolean, input: InputElement) {
    const fieldName = input.name;
    const field = this.fieldsStore.getField(fieldName);

    if (field === undefined) {
      // Means the field (<input name="username">) does not have a FieldFeedbacks
      // so let's ignore this field
    }

    else if (forceValidateFields || !field.hasFeedbacks()) {
      field.clearValidations();

      this.emitFieldWillValidateEvent(fieldName);

      const arrayOfArrays = await this.emitValidateFieldEvent(input);

      // Internal check that everything is OK
      // Can be temporary out of sync if the user rapidly change the input, in this case:
      // emitFieldWillValidateEvent() returns the result of the first change while the store already contains the final validations
      console.assert(
        JSON.stringify(flattenDeep<FieldFeedbackValidation | undefined>(arrayOfArrays).filter(notUndefined)) /* validationsFromEmitValidateFieldEvent */
        ===
        JSON.stringify(field.validations) /* validationsFromStore */
        ,
        `FieldsStore does not match emitValidateFieldEvent() result, did the user changed the input rapidly?`
      );

      this.emitFieldDidValidateEvent(field);
    }

    return field;
  }

  // If called without arguments, returns all fields ($('[name]'))
  // Returns the inputs in the same order they were given
  protected normalizeInputs(...inputsOrNames: Array<InputElement /* HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement... */ | string>) {
    let inputs;

    if (inputsOrNames.length === 0) {
      // [name] matches <input name="...">, <select name="...">, <button name="...">, ...
      // See Convert JavaScript NodeList to Array? https://stackoverflow.com/a/33822526/990356
      inputs = [...this.form!.querySelectorAll<HTMLInputElement>('[name]')];

      // Check we have unique names
      inputs
        .filter(input => input.type !== 'checkbox' && input.type !== 'radio')
        .map(input => input.name)
        .forEach((name, index, self) => {
          if (self.indexOf(name) !== index) {
            throw new Error(`Multiple elements matching '[name="${name}"]' inside the form`);
          }
        });
    } else {
      inputs = inputsOrNames.map(input => {
        if (typeof input === 'string') {
          const query = `[name="${input}"]`;
          const elements = [...this.form!.querySelectorAll<HTMLInputElement>(query)];

          // Checks

          if (elements.filter(el => el.type !== 'checkbox' && el.type !== 'radio').length > 1) {
            throw new Error(`Multiple elements matching '${query}' inside the form`);
          }
          const element = elements[0];
          if (element === undefined) {
            throw new Error(`Could not find field '${query}' inside the form`);
          }

          return element;
        } else {
          return input;
        }
      });
    }

    return inputs;
  }

  // More like seemsToBeValid(): return true if fields are untouched
  isValid() {
    return this.fieldsStore.isValid();
  }

  hasFeedbacks() {
    return this.fieldsStore.hasFeedbacks();
  }

  reset() {
    this.fieldsStore.clearFieldsValidations();
    return this.emitResetEvent();
  }

  render() {
    return <form ref={form => this.form = form} {...this.props} />;
  }
}
