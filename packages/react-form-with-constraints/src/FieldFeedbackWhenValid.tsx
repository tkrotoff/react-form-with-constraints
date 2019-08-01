import * as React from 'react';
import * as PropTypes from 'prop-types';

import { FormWithConstraints, FormWithConstraintsChildContext } from './FormWithConstraints';
import { FieldFeedbacks, FieldFeedbacksChildContext } from './FieldFeedbacks';
import { FieldFeedbackClasses } from './FieldFeedback';
import Field from './Field';

export interface FieldFeedbackWhenValidBaseProps {}

export interface FieldFeedbackWhenValidProps
  extends FieldFeedbackWhenValidBaseProps,
    FieldFeedbackClasses,
    React.HTMLAttributes<HTMLSpanElement> {}

interface FieldFeedbackWhenValidState {
  fieldIsValid: boolean | undefined;
}

export type FieldFeedbackWhenValidContext = FormWithConstraintsChildContext &
  FieldFeedbacksChildContext;

export class FieldFeedbackWhenValid<
  Props extends FieldFeedbackWhenValidBaseProps = FieldFeedbackWhenValidProps
> extends React.Component<Props, FieldFeedbackWhenValidState> {
  static contextTypes: React.ValidationMap<FieldFeedbackWhenValidContext> = {
    form: PropTypes.instanceOf(FormWithConstraints).isRequired,
    fieldFeedbacks: PropTypes.instanceOf(FieldFeedbacks).isRequired
  };
  context!: FieldFeedbackWhenValidContext;

  state: FieldFeedbackWhenValidState = {
    fieldIsValid: undefined
  };

  /* eslint-disable react/destructuring-assignment */

  componentWillMount() {
    this.context.form.addFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.addFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.addFieldDidResetEventListener(this.fieldDidReset);
  }

  componentWillUnmount() {
    this.context.form.removeFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.removeFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.removeFieldDidResetEventListener(this.fieldDidReset);
  }

  fieldWillValidate = (fieldName: string) => {
    // Ignore the event if it's not for us
    if (fieldName === this.context.fieldFeedbacks.fieldName) {
      this.setState({ fieldIsValid: undefined });
    }
  };

  fieldDidValidate = (field: Field) => {
    // Ignore the event if it's not for us
    if (field.name === this.context.fieldFeedbacks.fieldName) {
      this.setState({ fieldIsValid: field.isValid() });
    }
  };

  fieldDidReset = (field: Field) => {
    // Ignore the event if it's not for us
    if (field.name === this.context.fieldFeedbacks.fieldName) {
      this.setState({ fieldIsValid: undefined });
    }
  };

  // Don't forget to update native/FieldFeedbackWhenValid.render()
  render() {
    const { style, ...otherProps } = (this.props as unknown) as FieldFeedbackWhenValidProps;

    return this.state.fieldIsValid ? (
      // <span style="display: block"> instead of <div> so FieldFeedbackWhenValid can be wrapped inside a <p>
      // otherProps before className because otherProps contains data-feedback
      <span {...otherProps} style={{ display: 'block', ...style }} />
    ) : null;
  }

  /* eslint-enable react/destructuring-assignment */
}
