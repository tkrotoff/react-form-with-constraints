import * as PropTypes from 'prop-types';
import {
  FormWithConstraints,
  Input as _Input,
  InputProps,
  InputContext,
  FieldFeedbacks,
  Async,
  FieldFeedback as _FieldFeedback,
  FieldFeedbackProps,
  FieldFeedbackContext
} from 'react-form-with-constraints';

// ## Error
//
// - Bootstrap 4 "input.form-control.is-invalid":
// see https://getbootstrap.com/docs/4.1/components/forms/#server-side
// see https://github.com/twbs/bootstrap/blob/v4.1.2/scss/_forms.scss#L245
//
// ## Warning
//
// - Bootstrap >= 4: not available
//
// - Bootstrap v4.0.0-alpha.6 "input.form-control.form-control-warning":
// see https://v4-alpha.getbootstrap.com/components/forms/#validation
// see https://github.com/twbs/bootstrap/blob/v4.0.0-alpha.6/scss/_forms.scss#L254
//
// - Bootstrap 3 "div.form-group.has-warning":
// see https://getbootstrap.com/docs/3.3/css/#forms-control-validation
// see https://github.com/twbs/bootstrap/blob/v3.3.7/less/forms.less#L431
//
// - Bootstrap 2 "div.control-group.warning":
// see https://getbootstrap.com/2.3.2/base-css.html#forms
// see https://github.com/twbs/bootstrap/blob/v2.3.2/less/forms.less#L347
//
// ## Info
//
// - Bootstrap >= 3: not available
//
// - Bootstrap 2 "div.control-group.info":
// see https://getbootstrap.com/2.3.2/base-css.html#forms
// see https://github.com/twbs/bootstrap/blob/v2.3.2/less/forms.less#L347
//
// ## WhenValid
//
// - Bootstrap 4 "input.form-control.is-valid":
// see https://getbootstrap.com/docs/4.1/components/forms/#server-side
// see https://github.com/twbs/bootstrap/blob/v4.1.2/scss/_forms.scss#L245

export class FieldFeedback extends _FieldFeedback {
  // FIXME Copy-pasted from FieldFeedback to support IE <= 10
  // See ["__proto__ is not supported on IE <= 10 so static properties will not be inherited"](https://babeljs.io/docs/en/caveats#classes-10-and-below)
  // [@babel/plugin-transform-proto-to-assign](https://babeljs.io/docs/en/babel-plugin-transform-proto-to-assign) did not work
  static contextTypes: React.ValidationMap<FieldFeedbackContext> = {
    form: PropTypes.instanceOf(FormWithConstraints).isRequired,
    fieldFeedbacks: PropTypes.instanceOf(FieldFeedbacks).isRequired,
    async: PropTypes.instanceOf(Async)
  };
  context!: FieldFeedbackContext;

  static defaultProps: FieldFeedbackProps = {
    // See https://github.com/facebook/react/issues/3725#issuecomment-169163998
    // See [React.Component.defaultProps objects are overridden, not merged?](https://stackoverflow.com/q/40428847)
    ..._FieldFeedback.defaultProps,
    classes: {
      error: 'invalid-feedback',
      warning: 'warning-feedback',
      info: 'info-feedback',
      whenValid: 'valid-feedback'
    }
  };
}

export class FieldFeedbackTooltip extends _FieldFeedback {
  // FIXME Copy-pasted from FieldFeedback to support IE <= 10
  // See ["__proto__ is not supported on IE <= 10 so static properties will not be inherited"](https://babeljs.io/docs/en/caveats#classes-10-and-below)
  // [@babel/plugin-transform-proto-to-assign](https://babeljs.io/docs/en/babel-plugin-transform-proto-to-assign) did not work
  static contextTypes: React.ValidationMap<FieldFeedbackContext> = {
    form: PropTypes.instanceOf(FormWithConstraints).isRequired,
    fieldFeedbacks: PropTypes.instanceOf(FieldFeedbacks).isRequired,
    async: PropTypes.instanceOf(Async)
  };
  context!: FieldFeedbackContext;

  static defaultProps: FieldFeedbackProps = {
    // See https://github.com/facebook/react/issues/3725#issuecomment-169163998
    // See [React.Component.defaultProps objects are overridden, not merged?](https://stackoverflow.com/q/40428847)
    ..._FieldFeedback.defaultProps,
    classes: {
      error: 'invalid-tooltip',
      warning: 'warning-tooltip',
      info: 'info-tooltip',
      whenValid: 'valid-tooltip'
    }
  };
}

export class Input extends _Input {
  // FIXME Copy-pasted from FieldFeedback to support IE <= 10
  // See ["__proto__ is not supported on IE <= 10 so static properties will not be inherited"](https://babeljs.io/docs/en/caveats#classes-10-and-below)
  // [@babel/plugin-transform-proto-to-assign](https://babeljs.io/docs/en/babel-plugin-transform-proto-to-assign) did not work
  static contextTypes: React.ValidationMap<InputContext> = {
    form: PropTypes.instanceOf(FormWithConstraints).isRequired
  };
  context!: InputContext;

  static defaultProps: InputProps = {
    classes: {
      isPending: 'is-pending',
      hasErrors: 'is-invalid',
      hasWarnings: 'is-warning',
      hasInfos: 'is-info',
      isValid: 'is-valid'
    }
  };
}

export { FormWithConstraints, FieldFeedbacks, Async };
