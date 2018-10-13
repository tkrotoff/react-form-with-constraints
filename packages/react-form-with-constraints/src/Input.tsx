import React from 'react';
import PropTypes from 'prop-types';

import { FormWithConstraints, FormWithConstraintsChildContext } from './FormWithConstraints';
import Field from './Field';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  innerRef?: React.Ref<HTMLInputElement>;
  classes: {
    [index: string]: string | undefined;
    isPending?: string;
    hasErrors?: string;
    hasWarnings?: string;
    hasInfos?: string;
    isValid?: string;
  };
}

interface InputState {
  field: undefined | 'pending' | Field;
}

export type InputContext = FormWithConstraintsChildContext;

export class Input extends React.Component<InputProps, InputState> {
  static contextTypes: React.ValidationMap<InputContext> = {
    form: PropTypes.instanceOf(FormWithConstraints).isRequired
  };
  context!: InputContext;

  static defaultProps: InputProps = {
    classes: {
      isPending: 'is-pending',
      hasErrors: 'has-errors',
      hasWarnings: 'has-warnings',
      hasInfos: 'has-infos',
      isValid: 'is-valid'
    }
  };

  state: InputState = {
    field: undefined
  };

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
    if (fieldName === this.props.name) { // Ignore the event if it's not for us
      this.setState({field: 'pending'});
    }
  }

  fieldDidValidate = (field: Field) => {
    if (field.name === this.props.name) { // Ignore the event if it's not for us
      this.setState({field});
    }
  }

  fieldDidReset = (field: Field) => {
    if (field.name === this.props.name) { // Ignore the event if it's not for us
      this.setState({field: undefined});
    }
  }

  fieldValidationStates() {
    const { field } = this.state;

    const states = [];

    if (field !== undefined) {
      if (field === 'pending') {
        states.push('isPending');
      } else {
        if (field.hasErrors()) states.push('hasErrors');
        if (field.hasWarnings()) states.push('hasWarnings');
        if (field.hasInfos()) states.push('hasInfos');
        if (field.isValid()) states.push('isValid');
      }
    }

    return states;
  }

  render() {
    const { innerRef, className, classes, ...inputProps } = this.props;
    const validationStates = this.fieldValidationStates();

    let classNames = className;
    validationStates.forEach(validationState => {
      const tmp = classes![validationState];
      if (tmp !== undefined) {
        classNames !== undefined ? classNames += ` ${tmp}` : classNames = tmp;
      }
    });

    return (
      <input ref={innerRef} {...inputProps} className={classNames} />
    );
  }
}
