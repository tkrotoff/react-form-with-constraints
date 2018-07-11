import React from 'react';

import { FormWithConstraints, FormWithConstraintsContext } from './FormWithConstraints';
import Field from './Field';

interface InputClasses {
  classes?: {
    [index: string]: string | undefined;
    error?: string;
    warning?: string;
    info?: string;
    whenValid?: string;
  };
}

interface InputProps extends InputClasses, React.InputHTMLAttributes<HTMLInputElement> {
  innerRef?: React.Ref<HTMLInputElement>;
}

interface Context {
  formWithConstraints: FormWithConstraints;
}

interface State {
  field: Field | undefined;
}

const Input: React.SFC<InputProps> = props =>
  <FormWithConstraintsContext.Consumer>
    {form => <InputPrivate {...props} formWithConstraints={form!} />}
  </FormWithConstraintsContext.Consumer>;

Input.defaultProps = {
  classes: {
    hasErrors: 'has-errors',
    hasWarnings: 'has-warnings',
    hasInfos: 'has-infos',
    isValid: 'is-valid'
  }
};

class InputPrivate extends React.Component<InputProps & Context, State> {
  state: State = {
    field: undefined
  };

  componentWillMount() {
    this.props.formWithConstraints.addFieldWillValidateEventListener(this.fieldWillValidate);
    this.props.formWithConstraints.addFieldDidValidateEventListener(this.fieldDidValidate);
    this.props.formWithConstraints.addResetEventListener(this.reset);
  }

  componentWillUnmount() {
    this.props.formWithConstraints.removeFieldWillValidateEventListener(this.fieldWillValidate);
    this.props.formWithConstraints.removeFieldDidValidateEventListener(this.fieldDidValidate);
    this.props.formWithConstraints.removeResetEventListener(this.reset);
  }

  fieldWillValidate = (fieldName: string) => {
    if (fieldName === this.props.name) { // Ignore the event if it's not for us
      this.setState({field: undefined});
    }
  }

  fieldDidValidate = (field: Field) => {
    if (field.name === this.props.name) { // Ignore the event if it's not for us
      this.setState({field});
    }
  }

  reset = () => {
    this.setState({field: undefined});
  }

  fieldValidationStates() {
    const { field } = this.state;

    const states = [];

    if (field !== undefined) {
      if (field.hasErrors()) states.push('hasErrors');
      if (field.hasWarnings()) states.push('hasWarnings');
      if (field.hasInfos()) states.push('hasInfos');
      if (field.isValid()) states.push('isValid');
    }
    return states;
  }

  render() {
    const { formWithConstraints, innerRef, className, classes, ...inputProps } = this.props;
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

export {
  Input,
  InputProps
};
