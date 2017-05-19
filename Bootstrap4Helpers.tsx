import * as React from 'react';

import { FormWithConstraintsContext, FormAssociatedContent } from './FormWithConstraints';

export interface FormGroupProps extends React.HTMLProps<HTMLDivElement> {
  for: string | string[];
}

export class FormGroup extends React.Component<FormGroupProps, void> {
  static contextTypes = {
    form: React.PropTypes.object
  };

  context: FormWithConstraintsContext;

  constructor(props: FormGroupProps) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.context.form.addListener(this.handleInputChange);
  }

  componentWillUnmount() {
    this.context.form.removeListener(this.handleInputChange);
  }

  handleInputChange(input: FormAssociatedContent) {
    const fieldName = this.props.for;
    if (input.name === fieldName) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  bootstrapValidationClassName(...fieldNames: string[]) {
    const form = this.context.form;
    return form.hasErrors(...fieldNames) ? 'has-danger' : (form.hasWarnings(...fieldNames) ? 'has-warning' : '');
  }

  render() {
    // See http://stackoverflow.com/a/40699547/990356
    let { ['for']: deletedKey, children, ...divProps } = this.props;

    let fieldNames = this.props.for as string[];
    if (typeof this.props.for === 'string') {
      fieldNames = [this.props.for];
    }

    const className = this.bootstrapValidationClassName(...fieldNames);

    return (
      <div className={'form-group ' + className} {...divProps}>
        {this.props.children}
      </div>
    );
  }
}


export interface LabelWithFormControlStyleProps extends React.HTMLProps<HTMLLabelElement> {
  for: string | string[];
}

export class LabelWithFormControlStyle extends React.Component<LabelWithFormControlStyleProps, void> {
  static contextTypes = {
    form: React.PropTypes.object
  };

  context: FormWithConstraintsContext;

  constructor(props: LabelWithFormControlStyleProps) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.context.form.addListener(this.handleInputChange);
  }

  componentWillUnmount() {
    this.context.form.removeListener(this.handleInputChange);
  }

  handleInputChange(input: FormAssociatedContent) {
    const fieldName = this.props.for;
    if (input.name === fieldName) { // Ignore the event if it's not for us
      this.forceUpdate();
    }
  }

  render() {
    // See http://stackoverflow.com/a/40699547/990356
    let { ['for']: deletedKey, style, children, ...labelProps } = this.props;

    let fieldNames = this.props.for as string[];
    if (typeof this.props.for === 'string') {
      fieldNames = [this.props.for];
    }

    const form = this.context.form;

    // See https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.5/scss/_variables.scss#L55
    const brandWarning = '#f0ad4e';
    const brandDanger = '#d9534f';
    style = {
      color: form.hasErrors(...fieldNames) ? brandDanger : form.hasWarnings(...fieldNames) ? brandWarning : ''
    };

    return (
      <label style={style} {...labelProps}>
        {this.props.children}
      </label>
    );
  }
}
