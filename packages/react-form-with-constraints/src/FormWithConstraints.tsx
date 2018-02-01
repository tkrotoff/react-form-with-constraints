import React from 'react';
import PropTypes from 'prop-types';

import { withValidateEventEmitter } from './withValidateEventEmitter';
import FieldFeedbackValidation from './FieldFeedbackValidation';
// @ts-ignore
// TS6133: 'EventEmitter' is declared but its value is never read.
// FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
import { EventEmitter } from './EventEmitter';
import Input from './Input';
import { FieldsStore } from './FieldsStore';

// See Form data validation https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
// See ReactJS Form Validation Approaches http://moduscreate.com/reactjs-form-validation-approaches/

/*
FormWithConstraints
  - input
  - FieldFeedbacks
    - FieldFeedback
    - FieldFeedback
    - ...
  - input
  - FieldFeedbacks
    - FieldFeedback
    - FieldFeedback
    - ...
  - ...

FormWithConstraints contains the FieldsStore:
{
  username: {
    dirty: true,
    errors: [0.0], // List of FieldFeedback keys
    warnings: [0.2, 1.1],
    infos: []
  },
  password: {
    dirty: false,
    errors: [],
    warnings: [],
    infos: []
  }
}
FieldsStore is passed to FieldFeedbacks and FieldFeedback thanks to React context.

Most of the intelligence is inside FieldFeedback validate() and render()

When an input changes (validateFields()):
 => FormWithConstraints notifies all FieldFeedbacks
  => FieldFeedbacks filters unrelated input changes and then notifies its FieldFeedback (validate())
   => FieldFeedback updates the FieldsStore and emits an event (validate())
    => FieldFeedbacks re-renders
*/

export interface FormWithConstraintsChildContext {
  form: FormWithConstraints;
}

export interface FormWithConstraintsProps extends React.FormHTMLAttributes<HTMLFormElement> {}

// FieldFeedbacks returns FieldFeedbackValidation[] | undefined and Async returns Promise<FieldFeedbackValidation[]> | undefined
type ListenerReturnType = FieldFeedbackValidation[] | Promise<FieldFeedbackValidation[]> | undefined | void /* void for react-form-with-constraints-bootstrap4 */;

export class FormWithConstraintsComponent extends React.Component<FormWithConstraintsProps> {}
export class FormWithConstraints extends withValidateEventEmitter<ListenerReturnType, typeof FormWithConstraintsComponent>(FormWithConstraintsComponent)
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
  private form: HTMLFormElement | null | undefined;

  fieldsStore = new FieldsStore();

  private fieldFeedbacksKey = 0;
  computeFieldFeedbacksKey() {
    return this.fieldFeedbacksKey++;
  }

  /**
   * Validates the given fields, either HTMLInputElements or field names.
   * If called without arguments, validates all fields ($('[name]')).
   */
  validateFields(...inputsOrNames: Array<Input | string>) {
    const validationsPromisesList = new Array<Promise<FieldFeedbackValidation[]>>();

    const inputs = this.normalizeInputs(...inputsOrNames);

    inputs.forEach(input => {
      const validationsPromises = this.emitValidateEvent(input)
        .filter(validation => validation !== undefined) // Remove undefined results
        .map(validation => Promise.resolve(validation!)); // Transforms all results into Promises

      validationsPromisesList.push(...validationsPromises);
    });

    return Promise.all(validationsPromisesList).then(validations =>
      // See Merge/flatten an array of arrays in JavaScript? https://stackoverflow.com/q/10865025/990356
      validations.reduce((prev, curr) => prev.concat(curr), [])
    );
  }

  // Validates only what's necessary (e.g. non-dirty fields)
  validateForm() {
    const validationsPromisesList = new Array<Promise<FieldFeedbackValidation[]>>();

    const inputs = this.normalizeInputs();

    inputs.forEach(input => {
      const field = this.fieldsStore.fields[input.name];
      if (field !== undefined && field.dirty === false) {
        const validationsPromises = this.emitValidateEvent(input)
          .filter(validation => validation !== undefined) // Remove undefined results
          .map(validation => Promise.resolve(validation!)); // Transforms all results into Promises

        validationsPromisesList.push(...validationsPromises);
      }
    });

    return Promise.all(validationsPromisesList).then(validations =>
      // See Merge/flatten an array of arrays in JavaScript? https://stackoverflow.com/q/10865025/990356
      validations.reduce((prev, curr) => prev.concat(curr), [])
    );
  }

  // If called without arguments, returns all fields ($('[name]')).
  private normalizeInputs(...inputsOrNames: Array<Input | string>) {
    const inputs = inputsOrNames.filter(inputOrName => typeof inputOrName !== 'string') as Input[];
    const fieldNames = inputsOrNames.filter(inputOrName => typeof inputOrName === 'string') as string[];

    let otherInputs: Input[] = [];

    // [name] matches <input name="...">, <select name="...">, <button name="...">, ...
    if (inputsOrNames.length === 0) {
      otherInputs = this.form!.querySelectorAll('[name]') as any;
    }
    if (fieldNames.length > 0) {
      const selectors = fieldNames.map(fieldName => `[name="${fieldName}"]`);
      otherInputs = this.form!.querySelectorAll(selectors.join(', ')) as any;
    }

    return [
      ...inputs,
      ...otherInputs
    ];
  }

  // Lazy check => the fields structure might be incomplete
  isValid() {
    const fieldNames = Object.keys(this.fieldsStore.fields);
    return !this.fieldsStore.hasErrors(...fieldNames);
  }

  reset() {
    this.fieldsStore.reset();
  }

  render() {
    const { children, ...formProps } = this.props;
    return <form ref={form => this.form = form} {...formProps}>{children}</form>;
  }
}
