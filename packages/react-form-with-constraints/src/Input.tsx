import * as React from 'react';
import { instanceOf } from 'prop-types';

import { Field } from './Field';
import { FormWithConstraints, FormWithConstraintsChildContext } from './FormWithConstraints';

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
    form: instanceOf(FormWithConstraints).isRequired
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

  /* eslint-disable react/destructuring-assignment */

  componentDidMount() {
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
    if (fieldName === this.props.name) {
      this.setState({ field: 'pending' });
    }
  };

  fieldDidValidate = (field: Field) => {
    // Ignore the event if it's not for us
    if (field.name === this.props.name) {
      this.setState({ field });
    }
  };

  fieldDidReset = (field: Field) => {
    // Ignore the event if it's not for us
    if (field.name === this.props.name) {
      this.setState({ field: undefined });
    }
  };

  /* eslint-enable react/destructuring-assignment */

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
        if (classNames !== undefined) {
          classNames += ` ${tmp}`;
        } else {
          classNames = tmp;
        }
      }
    });

    return <input ref={innerRef} {...inputProps} className={classNames} />;
  }
}
