import * as React from 'react';
import * as PropTypes from 'prop-types';

import {
  FormControl as _FormControl,
  TextField as _TextField,
  MuiThemeProvider,
  Theme,
  createMuiTheme,
  createStyles,
  withStyles,
  WithStyles
} from '@material-ui/core';
import { FormControlProps } from '@material-ui/core/FormControl';
import { TextFieldProps } from '@material-ui/core/TextField';

import {
  FormWithConstraints as _FormWithConstraints,
  FormWithConstraintsChildContext,
  FieldFeedbacks,
  Async,
  FieldFeedback as _FieldFeedback,
  FieldFeedbackBaseProps,
  Field,
  deepForEach
} from 'react-form-with-constraints';

interface FormControlState {
  field: Field | undefined;
}

type FormControlContext = FormWithConstraintsChildContext;

export class FormControl extends React.Component<FormControlProps, FormControlState> {
  static contextTypes: React.ValidationMap<FormControlContext> = {
    form: PropTypes.instanceOf(_FormWithConstraints).isRequired
  };
  context!: FormControlContext;

  state: FormControlState = {
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

    console.assert(
      fieldNames.size === 1,
      `0 or multiple [name="*"] instead of 1: '${[...fieldNames]}'`
    );

    // Return the first and only entry
    return fieldNames.values().next().value;
  }

  fieldWillValidate = (fieldName: string) => {
    // Ignore the event if it's not for us
    if (fieldName === this.getAssociatedFieldName()) {
      this.setState({ field: undefined });
    }
  };

  fieldDidValidate = (field: Field) => {
    // Ignore the event if it's not for us
    if (field.name === this.getAssociatedFieldName()) {
      this.setState({ field });
    }
  };

  fieldDidReset = (field: Field) => {
    // Ignore the event if it's not for us
    if (field.name === this.getAssociatedFieldName()) {
      this.setState({ field: undefined });
    }
  };

  render() {
    const { field } = this.state;
    const error = field !== undefined && field.hasErrors();
    return <_FormControl error={error} {...this.props} />;
  }
}

interface TextFieldState {
  field: Field | undefined;
}

export class TextField extends React.Component<TextFieldProps, TextFieldState> {
  static contextTypes: React.ValidationMap<FormControlContext> = {
    form: PropTypes.instanceOf(_FormWithConstraints).isRequired
  };
  context!: FormControlContext;

  state: TextFieldState = {
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
    // Ignore the event if it's not for us
    if (fieldName === this.props.name) {
      this.setState({ field: undefined });
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

  render() {
    const { field } = this.state;
    const error = field !== undefined && field.hasErrors();
    return <_TextField error={error} {...this.props} />;
  }
}

const defaultTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

// See https://v3-5-0.material-ui.com/customization/themes/#nesting-the-theme
function formWithConstraintsTheme(outerTheme: Theme | null) {
  return {
    ...(outerTheme ? outerTheme : defaultTheme),
    overrides: {
      MuiFormHelperText: {
        root: {
          // Make FormHelperText invisible when there is no content
          // See https://github.com/mui-org/material-ui/blob/v3.5.1/packages/material-ui/src/FormHelperText/FormHelperText.js#L14-L16
          '&:empty': {
            marginTop: 0,
            minHeight: 0
          }
        }
      }
    }
  };
}

export class FormWithConstraints extends _FormWithConstraints {
  render() {
    return <MuiThemeProvider theme={formWithConstraintsTheme}>{super.render()}</MuiThemeProvider>;
  }
}

function fieldFeedbackStyles(theme: Theme) {
  return createStyles({
    root: {
      // Simulates FormHelperText margin
      // See https://github.com/mui-org/material-ui/blob/v1.0.0-beta.44/packages/material-ui/src/Form/FormHelperText.js#L12
      '&:not(:last-child)': {
        marginBottom: theme.spacing.unit
      }
    }
  });
}

type FieldFeedbackPropsWithStyles = FieldFeedbackBaseProps &
  React.HTMLAttributes<HTMLSpanElement> &
  WithStyles<typeof fieldFeedbackStyles>;

export const FieldFeedback = withStyles(fieldFeedbackStyles)(
  // Without a class name (class extends React.Component) React Developer Tools displays:
  // <WithStyles(Component) ...>
  //   <Component>
  //     <FieldFeedbackWS className="Component-root-125" ...></FieldFeedback>
  //   </Component>
  // </WithStyles(Component)>
  //
  // With a class name React Developer Tools displays:
  // <WithStyles(FieldFeedbackWS) ...>
  //   <FieldFeedbackWS>
  //     <FieldFeedbackWS className="FieldFeedbackWS-root-125" ...></FieldFeedback>
  //   </FieldFeedbackWS>
  // </WithStyles(FieldFeedbackWS)>
  class FieldFeedbackWS extends React.Component<FieldFeedbackPropsWithStyles> {
    render() {
      const { classes, className, ...otherProps } = this.props;

      const classNames = className !== undefined ? `${className} ${classes.root}` : classes.root;

      return <_FieldFeedback className={classNames} {...otherProps} />;
    }
  }
);

export { FieldFeedbacks, Async };
