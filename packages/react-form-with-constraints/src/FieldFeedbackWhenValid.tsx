import React from 'react';
import PropTypes from 'prop-types';

import { FormWithConstraintsChildContext } from './FormWithConstraints';
import { FieldFeedbacksChildContext } from './FieldFeedbacks';
import Field from './Field';

export interface FieldFeedbackWhenValidProps extends React.HTMLAttributes<HTMLDivElement> {
}

export interface FieldFeedbackWhenValidState {
  fieldIsValid: boolean | undefined;
}

export type FieldFeedbackWhenValidContext = FormWithConstraintsChildContext & FieldFeedbacksChildContext;

export class FieldFeedbackWhenValid extends React.Component<FieldFeedbackWhenValidProps, FieldFeedbackWhenValidState> {
  static contextTypes: React.ValidationMap<FieldFeedbackWhenValidContext> = {
    form: PropTypes.object.isRequired,
    fieldFeedbacks: PropTypes.object.isRequired
  };
  context!: FieldFeedbackWhenValidContext;

  constructor(props: FieldFeedbackWhenValidProps) {
    super(props);

    this.state = {
      fieldIsValid: undefined
    };

    this.fieldWillValidate = this.fieldWillValidate.bind(this);
    this.fieldDidValidate = this.fieldDidValidate.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentWillMount() {
    const { form } = this.context;

    form.addFieldWillValidateEventListener(this.fieldWillValidate);
    form.addFieldDidValidateEventListener(this.fieldDidValidate);
    form.addResetEventListener(this.reset);
  }

  componentWillUnmount() {
    const { form } = this.context;

    form.removeFieldWillValidateEventListener(this.fieldWillValidate);
    form.removeFieldDidValidateEventListener(this.fieldDidValidate);
    form.removeResetEventListener(this.reset);
  }

  fieldWillValidate(fieldName: string) {
    if (fieldName === this.context.fieldFeedbacks.fieldName) { // Ignore the event if it's not for us
      this.setState({fieldIsValid: undefined});
    }
  }

  fieldDidValidate(field: Field) {
    if (field.name === this.context.fieldFeedbacks.fieldName) { // Ignore the event if it's not for us
      this.setState({fieldIsValid: field.isValid()});
    }
  }

  reset() {
    this.setState({fieldIsValid: undefined});
  }

  // Don't forget to update native/FieldFeedbackWhenValid.render()
  render() {
    const { className, ...otherProps } = this.props;

    let classNames = this.context.form.props.fieldFeedbackClassNames!.valid;
    classNames = className !== undefined ? `${className} ${classNames}` : classNames;

                                          // otherProps before className because otherProps contains data-feedback
    return this.state.fieldIsValid ? <div {...otherProps} className={classNames} /> : null;
  }
}
