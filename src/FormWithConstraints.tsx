import * as React from 'react';
import * as PropTypes from 'prop-types';

import { IValidateEventEmitter, withValidateEventEmitter } from './withValidateEventEmitter';
import { EventEmitter } from './EventEmitter'; // FIXME See https://github.com/Microsoft/TypeScript/issues/9944#issuecomment-309903027
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
  form: IFormWithConstraints;
}

export interface FormWithConstraintsProps extends React.AllHTMLAttributes<HTMLFormElement> {}

export interface IFormWithConstraints extends IValidateEventEmitter {
  fieldsStore: FieldsStore;
  computeFieldFeedbacksKey(): number;
}

export class FormWithConstraintsComponent extends React.Component<FormWithConstraintsProps> {}
export class FormWithConstraints extends withValidateEventEmitter(FormWithConstraintsComponent) implements IFormWithConstraints {
  static childContextTypes = {
    form: PropTypes.object.isRequired
  };
  getChildContext(): FormWithConstraintsChildContext {
    return {
      form: this
    };
  }

  form: HTMLFormElement;

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
    const inputs = inputsOrNames.filter(inputOrName => typeof inputOrName !== 'string') as Input[];
    const fieldNames = inputsOrNames.filter(inputOrName => typeof inputOrName === 'string') as string[];

    let otherInputs: Input[] = [];

    // [name] matches <input name="...">, <select name="...">, <button name="...">, ...
    if (inputsOrNames.length === 0) {
      otherInputs = this.form.querySelectorAll('[name]') as any;
    }
    if (fieldNames.length > 0) {
      const selectors = fieldNames.map(fieldName => `[name="${fieldName}"]`);
      otherInputs = this.form.querySelectorAll(selectors.join(', ')) as any;
    }

    [
      ...inputs,
      ...otherInputs
    ].forEach(input => this.emitValidateEvent(input));
  }

  // Lazy check => the fields structure might be incomplete
  isValid() {
    const fieldNames = Object.keys(this.fieldsStore.fields);
    return !this.fieldsStore.containErrors(...fieldNames);
  }

  render() {
    const { children, ...formProps } = this.props;
    return <form ref={form => this.form = form as any} {...formProps}>{children}</form>;
  }
}
