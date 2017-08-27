import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  FormWithConstraintsContext, FormFields, Input,
  FieldFeedbacks as FieldFeedbacks_, FieldFeedbacksProps
} from './FormWithConstraints';

export interface FormGroupProps extends React.HTMLProps<HTMLDivElement> {
  for?: string;
}

export class FormGroup extends React.Component<FormGroupProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };

  context: FormWithConstraintsContext;

  constructor(props: FormGroupProps) {
    super(props);

    this.reRender = this.reRender.bind(this);
  }

  componentDidMount() {
    this.context.form.addInputChangeOrFormSubmitEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.removeInputChangeOrFormSubmitEventListener(this.reRender);
  }

  reRender(input: Input) {
    const fieldName = this.props.for;
    if (input.name === fieldName) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  className(fieldName: string | undefined) {
    let className = 'form-group';
    if (fieldName !== undefined) {
      const form = this.context.form;
      if (FormFields.containErrors(form, fieldName)) {
        className += ' has-danger';
      }
      else if (FormFields.containWarnings(form, fieldName)) {
        className += ' has-warning';
      }
      else if (FormFields.areValidDirtyWithoutWarnings(form, fieldName)) {
        className += ' has-success';
      }
    }
    return className;
  }

  render() {
    let { for: fieldName, children, ...divProps } = this.props;

    return (
      <div {...divProps} className={this.className(fieldName)}>
        {this.props.children}
      </div>
    );
  }
}


export interface FormControlLabelProps extends React.HTMLProps<HTMLLabelElement> {
}

const FormControlLabel: React.SFC<FormControlLabelProps> = props => {
  let { children, ...labelProps } = props;

  return (
    <label {...labelProps} className="form-control-label">
      {props.children}
    </label>
  );
};
export { FormControlLabel };


export interface FormControlInputProps extends React.HTMLProps<HTMLInputElement> {
}

export class FormControlInput extends React.Component<FormControlInputProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };

  context: FormWithConstraintsContext;

  constructor(props: FormControlInputProps) {
    super(props);

    this.reRender = this.reRender.bind(this);
  }

  componentDidMount() {
    this.context.form.addInputChangeOrFormSubmitEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.removeInputChangeOrFormSubmitEventListener(this.reRender);
  }

  reRender(input: Input) {
    const fieldName = this.props.name;
    if (input.name === fieldName) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  className(name: string | undefined) {
    let className = 'form-control';
    if (name !== undefined) {
      const form = this.context.form;
      if (FormFields.containErrors(form, name)) {
        className += ' form-control-danger';
      }
      else if (FormFields.containWarnings(form, name)) {
        className += ' form-control-warning';
      }
      else if (FormFields.areValidDirtyWithoutWarnings(form, name)) {
        className += ' form-control-success';
      }
    }
    return className;
  }

  render() {
    let { children, ...inputProps } = this.props;

    return (
      <input {...inputProps} className={this.className(inputProps.name)} />
    );
  }
}


const FieldFeedbacks: React.SFC<FieldFeedbacksProps> = props => {
  return <FieldFeedbacks_ {...props as any} className="form-control-feedback">{props.children}</FieldFeedbacks_>;
};
export { FieldFeedbacks };


export interface LabelWithFormControlStyleProps extends React.HTMLProps<HTMLLabelElement> {
  for: string[];
}

export class LabelWithFormControlStyle extends React.Component<LabelWithFormControlStyleProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };

  context: FormWithConstraintsContext;

  constructor(props: LabelWithFormControlStyleProps) {
    super(props);

    this.reRender = this.reRender.bind(this);
  }

  componentDidMount() {
    this.context.form.addInputChangeOrFormSubmitEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.removeInputChangeOrFormSubmitEventListener(this.reRender);
  }

  reRender(input: Input) {
    const fieldNames = this.props.for;
    if (fieldNames.includes(input.name)) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  render() {
    const { for: fieldNames, style, children, ...labelProps } = this.props;

    const form = this.context.form;

    // See https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/scss/_variables.scss#L118
    const brandDanger = '#d9534f';
    const brandWarning = '#f0ad4e';
    const brandSuccess = '#5cb85c';

    let color: string | undefined = undefined;
    if (FormFields.containErrors(form, ...fieldNames)) {
      color = brandDanger;
    }
    else if (FormFields.containWarnings(form, ...fieldNames)) {
      color = brandWarning;
    }
    else if (FormFields.areValidDirtyWithoutWarnings(form, ...fieldNames)) {
      color = brandSuccess;
    }

    return (
      <label style={{color}} {...labelProps}>
        {this.props.children}
      </label>
    );
  }
}
