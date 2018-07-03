import React from 'react';
import PropTypes from 'prop-types';

import {
  FormControl as _FormControl,
  TextField as _TextField,
  MuiThemeProvider, createMuiTheme, Theme,
  createStyles, withStyles, WithStyles
} from '@material-ui/core';
import { FormControlProps } from '@material-ui/core/FormControl';
import { TextFieldProps } from '@material-ui/core/TextField';

import {
  FormWithConstraints as _FormWithConstraints, FormWithConstraintsChildContext,
  FieldFeedbacks, Async, FieldFeedback as _FieldFeedback, FieldFeedbackBaseProps, Field,
  deepForEach
} from 'react-form-with-constraints';

export interface FormControlState {
  field: Field | undefined;
}

export type FormControlContext = FormWithConstraintsChildContext;

export class FormControl extends React.Component<FormControlProps, FormControlState> {
  static contextTypes: React.ValidationMap<FormControlContext> = {
    form: PropTypes.object.isRequired
  };
  context!: FormControlContext;

  state: FormControlState = {
    field: undefined
  };

  componentWillMount() {
    this.context.form.addFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.addFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.addResetEventListener(this.reset);
  }

  componentWillUnmount() {
    this.context.form.removeFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.removeFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.removeResetEventListener(this.reset);
  }

  getAssociatedFieldName() {
    const fieldNames = new Set<string>();

    deepForEach(this.props.children, child => {
      if (child.props !== undefined) {
        const fieldName = child.props.name;
        if (fieldName !== undefined && fieldName.length > 0) {
          fieldNames.add(fieldName);
        }
      }
    });

    console.assert(fieldNames.size === 1, `0 or multiple [name="*"] instead of 1: '${[...fieldNames]}'`);

    // Return the first and only entry
    return fieldNames.values().next().value;
  }

  fieldWillValidate = (fieldName: string) => {
    if (fieldName === this.getAssociatedFieldName()) { // Ignore the event if it's not for us
      this.setState({field: undefined});
    }
  }

  fieldDidValidate = (field: Field) => {
    if (field.name === this.getAssociatedFieldName()) { // Ignore the event if it's not for us
      this.setState({field});
    }
  }

  reset = () => {
    this.setState({field: undefined});
  }

  render() {
    const { field } = this.state;
    const error = field !== undefined && field.hasErrors();
    return <_FormControl error={error} {...this.props} />;
  }
}

export class TextFieldState {
  field: Field | undefined;
}

export class TextField extends React.Component<TextFieldProps, TextFieldState> {
  static contextTypes: React.ValidationMap<FormControlContext> = {
    form: PropTypes.object.isRequired
  };
  context!: FormControlContext;

  state: TextFieldState = {
    field: undefined
  };

  componentWillMount() {
    this.context.form.addFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.addFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.addResetEventListener(this.reset);
  }

  componentWillUnmount() {
    this.context.form.removeFieldWillValidateEventListener(this.fieldWillValidate);
    this.context.form.removeFieldDidValidateEventListener(this.fieldDidValidate);
    this.context.form.removeResetEventListener(this.reset);
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

  render() {
    const { field } = this.state;
    const error = field !== undefined && field.hasErrors();
    return <_TextField error={error} {...this.props} />;
  }
}

const formWithConstraintsTheme = createMuiTheme({
  overrides: {
    MuiFormHelperText: {
      root: {
        // Make FormHelperText invisible when there is no content
        // See https://github.com/mui-org/material-ui/blob/v1.0.0-beta.44/packages/material-ui/src/Form/FormHelperText.js#L12
        '&:empty': {
          marginTop: 0,
          minHeight: 0
        }
      }
    }
  }
});

export class FormWithConstraints extends _FormWithConstraints {
  render() {
    return (
      <MuiThemeProvider theme={formWithConstraintsTheme}>
        {super.render()}
      </MuiThemeProvider>
    );
  }
}

const fieldFeedbackStyles = (theme: Theme) => createStyles({
  root: {
    // Simulates FormHelperText margin
    // See https://github.com/mui-org/material-ui/blob/v1.0.0-beta.44/packages/material-ui/src/Form/FormHelperText.js#L12
    '&:not(:last-child)': {
      marginBottom: theme.spacing.unit
    }
  }
});

type FieldFeedbackPropsWithStyles = FieldFeedbackBaseProps & React.HTMLAttributes<HTMLSpanElement> & WithStyles<typeof fieldFeedbackStyles>;

export const FieldFeedback = withStyles(fieldFeedbackStyles, {name: 'FieldFeedback'})<FieldFeedbackBaseProps & React.HTMLAttributes<HTMLSpanElement>>(
  class extends React.Component<FieldFeedbackPropsWithStyles> {
    render() {
      const { classes, className, ...otherProps } = this.props;

      const classNames = className !== undefined ? `${className} ${classes.root}` : classes.root;

      return (
        <_FieldFeedback className={classNames} {...otherProps} />
      );
    }
  }
);

export { FieldFeedbacks, Async };
