import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormWithConstraintsChildContext } from './FormWithConstraints';
import { FieldFeedbacksChildContext } from './FieldFeedbacks';
import { AsyncChildContext } from './Async';
import Input from './Input';
import FieldFeedbackValidation from './FieldFeedbackValidation';
import { FieldEvent } from './FieldsStore';

export type WhenString =
  | '*'
  | 'badInput'        // input type="number"
  | 'patternMismatch' // pattern attribute
  | 'rangeOverflow'   // max attribute
  | 'rangeUnderflow'  // min attribute
  | 'stepMismatch'    // step attribute
  | 'tooLong'         // maxlength attribute
  | 'tooShort'        // minlength attribute
  | 'typeMismatch'    // input type="email" or input type="url"
  | 'valueMissing';   // required attribute
export type WhenFn = (value: string) => boolean;
export type When = WhenString | WhenFn;

export interface FieldFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  when?: When;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
}

export type FieldFeedbackContext = FormWithConstraintsChildContext & FieldFeedbacksChildContext & Partial<AsyncChildContext>;

export class FieldFeedback extends React.Component<FieldFeedbackProps> {
  static defaultProps: Partial<FieldFeedbackProps> = {
    when: () => true
  };

  static contextTypes: React.ValidationMap<FieldFeedbackContext> = {
    form: PropTypes.object.isRequired,
    fieldFeedbacks: PropTypes.object.isRequired,
    async: PropTypes.object
  };
  context!: FieldFeedbackContext;

  // Example: key=0.1
  key: number;

  constructor(props: FieldFeedbackProps, context: FieldFeedbackContext) {
    super(props);

    this.key = context.fieldFeedbacks.addFieldFeedback();

    this.validate = this.validate.bind(this);
    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    if (this.context.async) this.context.async.addValidateEventListener(this.validate);
    else this.context.fieldFeedbacks.addValidateEventListener(this.validate);

    this.context.form.fieldsStore.addListener(FieldEvent.Updated, this.reRender);
  }

  componentWillUnmount() {
    // FieldFeedbacks.componentWillUnmount() is called before (instead of after) its children FieldFeedback.componentWillUnmount()
    this.context.fieldFeedbacks.removeFieldFeedback(this.key);

    if (this.context.async) this.context.async.removeValidateEventListener(this.validate);
    else this.context.fieldFeedbacks.removeValidateEventListener(this.validate);

    this.context.form.fieldsStore.removeListener(FieldEvent.Updated, this.reRender);
  }

  // Generates Field for Fields structure
  validate(input: Input) {
    const { when } = this.props;
    const { fieldFeedbacks } = this.context;

    const validation: FieldFeedbackValidation = {
      key: this.key,
      isValid: undefined
    };

    if (fieldFeedbacks.props.stop === 'first-error' && fieldFeedbacks.hasErrors()) {
      // No need to perform validation if another FieldFeedback is already invalid
    }
    else {
      let show = false;

      if (typeof when === 'function') {
        const constraintViolation = when(input.value);
        if (constraintViolation) {
          show = true;
        }
      }

      else if (typeof when === 'string') {
        const validity = input.validity;

        if (!validity.valid) {
          if (when === '*') {
            show = true;
          }
          else if (
            validity.badInput && when === 'badInput' ||
            validity.patternMismatch && when === 'patternMismatch' ||
            validity.rangeOverflow && when === 'rangeOverflow' ||
            validity.rangeUnderflow && when === 'rangeUnderflow' ||
            validity.stepMismatch && when === 'stepMismatch' ||
            validity.tooLong && when === 'tooLong' ||
            validity.tooShort && when === 'tooShort' ||
            validity.typeMismatch && when === 'typeMismatch' ||
            validity.valueMissing && when === 'valueMissing') {

            show = true;
          }
        }
      }

      else {
        throw new TypeError(`Invalid FieldFeedback 'when' type: ${typeof when}`);
      }

      this.updateFieldsStore(input, show);

      validation.isValid = this.isValid();
    }

    return validation;
  }

  // Update the Fields structure
  updateFieldsStore(input: Input, show: boolean) {
    const { warning, info } = this.props;
    const fieldName = this.context.fieldFeedbacks.props.for;

    const field = this.context.form.fieldsStore.cloneField(fieldName);
    field.dirty = true;
    field.validationMessage = input.validationMessage;
    if (show) {
      // No need to "append if not already there": Set ignores duplicates
      if (warning) field.warnings.add(this.key);
      else if (info) field.infos.add(this.key);
      else field.errors.add(this.key); // Feedback type is error if nothing is specified
    }
    this.context.form.fieldsStore.updateField(fieldName, field);
  }

  isValid() {
    const { fieldFeedbacks } = this.context;
    const { for: fieldName } = fieldFeedbacks.props;

    const field = this.context.form.fieldsStore.getFieldFor(fieldName, fieldFeedbacks.key);
    return !field.errors.has(this.key);
  }

  className() {
    const { fieldFeedbacks } = this.context;
    const { for: fieldName } = fieldFeedbacks.props;

    // Retrieve errors/warnings/infos only related to the parent FieldFeedbacks
    const { errors, warnings, infos } = this.context.form.fieldsStore.getFieldFor(fieldName, fieldFeedbacks.key);

    let className: string | undefined;

    if (errors.has(this.key)) className = 'error';
    else if (warnings.has(this.key)) className = 'warning';
    else if (infos.has(this.key)) className = 'info';

    return className;
  }

  reRender(_fieldName: string) {
    const fieldName = this.context.fieldFeedbacks.props.for;
    if (fieldName === _fieldName) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  render() {
    const { when, error, warning, info, className, children, ...divProps } = this.props;
    const { form, fieldFeedbacks } = this.context;
    const { for: fieldName } = fieldFeedbacks.props;
    const { validationMessage } = form.fieldsStore.getFieldFor(fieldName, fieldFeedbacks.key);

    let classes = this.className();

    let feedback = null;
    if (classes !== undefined) { // Means the FieldFeedback should be displayed
      classes = className !== undefined ? `${className} ${classes}` : classes;
      feedback = children !== undefined ? children : validationMessage;
    }

    return feedback !== null ? <div {...divProps} className={classes}>{feedback}</div> : null;
  }
}
