import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  Input, FormWithConstraintsChildContext,
  FieldFeedbacks as FieldFeedbacks_, FieldFeedbacksProps
} from './index';

export interface FormGroupProps extends React.AllHTMLAttributes<HTMLDivElement> {
  for?: string;
}

export class FormGroup extends React.Component<FormGroupProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };
  context: FormWithConstraintsChildContext;

  constructor(props: FormGroupProps) {
    super(props);
    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    this.context.form.addValidateEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.removeValidateEventListener(this.reRender);
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
      if (form.fieldsStore.containErrors(fieldName)) {
        className += ' has-danger';
      }
      else if (form.fieldsStore.containWarnings(fieldName)) {
        className += ' has-warning';
      }
      else if (form.fieldsStore.areValidDirtyWithoutWarnings(fieldName)) {
        className += ' has-success';
      }
    }
    return className;
  }

  render() {
    const { for: fieldName, className, children, ...divProps } = this.props;
    const classes = className !== undefined ? `${className} ${this.className(fieldName)}` : this.className(fieldName);
    return (
      <div {...divProps} className={classes}>{children}</div>
    );
  }
}


export interface FormControlLabelProps extends React.AllHTMLAttributes<HTMLLabelElement> {}

const FormControlLabel: React.SFC<FormControlLabelProps> = props => {
  const { className, children, ...labelProps } = props;
  const classes = className !== undefined ? `${className} form-control-label` : 'form-control-label';
  return (
    <label {...labelProps} className={classes}>{children}</label>
  );
};
export { FormControlLabel };


export interface FormControlInputProps extends React.AllHTMLAttributes<HTMLInputElement> {
  innerRef?: React.Ref<HTMLInputElement>;
}

export class FormControlInput extends React.Component<FormControlInputProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };
  context: FormWithConstraintsChildContext;

  constructor(props: FormControlInputProps) {
    super(props);
    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    this.context.form.addValidateEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.removeValidateEventListener(this.reRender);
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
      if (form.fieldsStore.containErrors(name)) {
        className += ' form-control-danger';
      }
      else if (form.fieldsStore.containWarnings(name)) {
        className += ' form-control-warning';
      }
      else if (form.fieldsStore.areValidDirtyWithoutWarnings(name)) {
        className += ' form-control-success';
      }
    }
    return className;
  }

  render() {
    const { innerRef, className, children, ...inputProps } = this.props;
    const classes = className !== undefined ? `${className} ${this.className(inputProps.name)}` : this.className(inputProps.name);
    return (
      <input ref={innerRef} {...inputProps} className={classes} />
    );
  }
}


const FieldFeedbacks: React.SFC<FieldFeedbacksProps> = props => {
  const { className, children, ...other } = props;
  const classes = className !== undefined ? `${className} form-control-feedback` : 'form-control-feedback';
  return <FieldFeedbacks_ {...other} className={classes}>{children}</FieldFeedbacks_>;
};
export { FieldFeedbacks };


export interface LabelWithFormControlStyleProps extends React.AllHTMLAttributes<HTMLLabelElement> {
  for: string[];
}

export class LabelWithFormControlStyle extends React.Component<LabelWithFormControlStyleProps> {
  static contextTypes = {
    form: PropTypes.object.isRequired
  };
  context: FormWithConstraintsChildContext;

  constructor(props: LabelWithFormControlStyleProps) {
    super(props);
    this.reRender = this.reRender.bind(this);
  }

  componentWillMount() {
    this.context.form.addValidateEventListener(this.reRender);
  }

  componentWillUnmount() {
    this.context.form.removeValidateEventListener(this.reRender);
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

    let color: string | undefined;
    if (form.fieldsStore.containErrors(...fieldNames)) {
      color = brandDanger;
    }
    else if (form.fieldsStore.containWarnings(...fieldNames)) {
      color = brandWarning;
    }
    else if (form.fieldsStore.areValidDirtyWithoutWarnings(...fieldNames)) {
      color = brandSuccess;
    }

    const styles = style !== undefined ? {color, ...style} : {color};

    return (
      <label {...labelProps} style={{styles}}>{children}</label>
    );
  }
}
