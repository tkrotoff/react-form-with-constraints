import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormWithConstraintsChildContext } from './FormWithConstraints';
import { FieldFeedbacksChildContext } from './FieldFeedbacks';
import Input from './Input';

// FIXME See Add tooShort to ValidityState https://github.com/Microsoft/TSJS-lib-generator/pull/259
export interface ValidityStateFix extends ValidityState {
  readonly tooShort: boolean;
}

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

export interface FieldFeedbackProps extends React.AllHTMLAttributes<HTMLDivElement> {
  when: When;
  error?: boolean;
  warning?: boolean;
  info?: boolean;
}

export type FieldFeedbackContext = FormWithConstraintsChildContext & FieldFeedbacksChildContext;

export class FieldFeedback extends React.Component<FieldFeedbackProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired,
    fieldFeedbacks: PropTypes.object.isRequired
  };
  context: FieldFeedbackContext;

  key: number;

  constructor(props: FieldFeedbackProps, context: FieldFeedbackContext) {
    super(props);

    this.validate = this.validate.bind(this);

    this.key = context.fieldFeedbacks.computeFieldFeedbackKey();
  }

  componentWillMount() {
    this.context.fieldFeedbacks.addValidateEventListener(this.validate);
  }

  componentWillUnmount() {
    this.context.fieldFeedbacks.removeValidateEventListener(this.validate);
  }

  // Generates Field for Fields structure
  validate(input: Input) {
    const { when, warning, info } = this.props;
    const { for: fieldName } = this.context.fieldFeedbacks.props;

    let show = false;

    if (typeof when === 'function') {
      const constraintViolation = when(input.value);
      if (constraintViolation) {
        show = true;
      }
    }

    else if (typeof when === 'string') {
      const validity = input.validity as ValidityStateFix;

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
      console.assert(false, `Invalid FieldFeedback 'when': ${when}`);
    }

    // Update the Fields structure
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

  render() {
    const { when, error, warning, info, className, children, ...divProps } = this.props;
    const { for: fieldName, show } = this.context.fieldFeedbacks.props;

    // Retrieve errors/warnings/infos only related to the parent FieldFeedbacks
    const { errors, warnings, infos, validationMessage } = this.context.form.fieldsStore.getFieldFor(fieldName, this.context.fieldFeedbacks.key);

    const firstError = errors.values().next().value;
    const firstWarning = warnings.values().next().value;

    let classes: string | undefined;
    if (errors.has(this.key) && (show === 'all' || (show === 'first' && firstError === this.key))) {
      classes = 'error';
    }
    else if (warnings.has(this.key) && (errors.size === 0 && (show === 'all' || (show === 'first' && firstWarning === this.key)))) {
      classes = 'warning';
    }
    else if (infos.has(this.key)) {
      classes = 'info';
    }

    let feedback = null;
    if (classes !== undefined) { // Means the FieldFeedback should be displayed
      classes = className !== undefined ? `${className} ${classes}` : classes;
      feedback = children !== undefined ? children : validationMessage;
    }

    return feedback !== null ? <div {...divProps} className={classes}>{feedback}</div> : null;
  }
}
